const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :body - :response-time ms'));
app.use(cors())


let persons = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": "1"
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": "2"
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": "3"
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": "4"
    }
]

// routes

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// gets Single entry route
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Deleting a phone book entry
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id) // persons has already been decleared tus remove the const

    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info of ${persons.length} people.</div>
                    <p>${Date()}</p>`)
})

// reciving new number
app.post('/api/persons', (request, response) => {
  const name = request.body
  const nameExist = persons.find(person => person.name.toLocaleLowerCase() === name.name.toLocaleLowerCase())
  const randomId = Math.floor(Math.random() * 4000000)

  if(nameExist || !name.name || !name.number || isNaN(name.number)) {
    return response.status(400).json({
      error: 'missing content or already exist'
    })
  }

  const details = {
    name: name.name,
    number: name.number,
    id: randomId.toString()
  }
  
  persons = persons.concat(details)
  response.json(details)

})

// PORT defination

const PORT = proces.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
  