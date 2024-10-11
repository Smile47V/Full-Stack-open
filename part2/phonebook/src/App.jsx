import { useState, useEffect } from 'react'
import call from './services/call'

const Button = ({text, func}) =>{
  
  return(
    <button onClick={func} >{text}</button>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [look, setLook] = useState('')
  const [erroMessage, seterroMessage] = useState('')

 // to get details from the server
  useEffect(() => {
    call.getAll().then(res => {
      console.log('api response:', res.data)
      if (Array.isArray(res.data)){
        setPersons(res.data);
      } else{
        console.error('Expected an array but got:', res.data)
        setPersons([])
      }
    })
    .catch(error => {
      console.error('Error fetching persons:', error);
      setPersons([])
      
    })
  }, [])
  
  //function to cheak for repetition

  const addName = (e) =>{
    e.preventDefault()

    //cheak if the name exists 
    //if it dosent execute the normall add process

    const nameExists = persons.find(person => person.name.toLocaleLowerCase() === newName.toLocaleLowerCase())

    
    
    if (nameExists) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const updatePerson = { ...nameExists, number: newNum};

        //server update
        call.update(nameExists.id, updatePerson)
        .then(response => {
          setPersons(persons.map(person => person.id !== nameExists.id ? person : response.data)) // explain futher : if the id of the cmaped person is not the one that was chANGE RETURN IT PRVIOUS DETAL ELSE RETURN THE NEW ONE.
          setNewName('')
          setNewNum('')
        }).catch(error => {
          alert(`failed to update ${newName}'s number`)
        })
      }
    } else {
      const nameObj ={
      name: newName,
      number: newNum,
      }

      call.create(nameObj).then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNum('')
        seterroMessage(
          `${nameObj.name} has been added sucesfully.`
        )
        setTimeout(()=>{
          seterroMessage(null)
        }, 5000)
      })

      /*setPersons(persons.concat(nameObj))
      setNewName('')
      setNewNum('')*/
    }
    
    
  }

  const nameChange = (e) =>{
    console.log(e.target.value)
    setNewName(e.target.value)
  }

  const numChange = (e) =>{
    console.log(e.target.value)
    setNewNum(e.target.value)
  }

  const search = (e) =>{
    console.log(e.target.value)
    setLook(e.target.value)
  }

  //filter the person array based on the search 

  //console.log('presons:', persons)
  const filtered = persons.filter(person =>
    person.name.toLowerCase().includes(look.toLocaleLowerCase())
  )

  //delete from the server
  const del = (id) => {
    call.remove(id).then(()=>{
    setPersons(prevPerson => prevPerson.filter(person => person.id !== id))
    }).catch( error =>{
      seterroMessage(
        `this Name has been removed alredy, Try refreshing the page`
      )
      setTimeout(()=>{
        seterroMessage(null)
      }, 5000)
    })
  } 
  


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={erroMessage} />
      <div>
        filter shown with<input value={look} onChange={search}/>
      </div>
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={nameChange}/>
        </div>
        <div>
          number: <input type='' value={newNum} onChange={numChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>{filtered.map((person, i) => {
        return <div key={person.id} >{person.name} {person.number} <Button text="Delete" func={() => del(person.id)} /></div>
      })}</div>
    </div>
  )
}

export default App
