require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body) // a configured morgan function to keep tab logs
})

app.use(morgan(':method :url :status :body - :response-time ms')) // this adds the morgan functionto the app
app.use(cors())
app.use(express.static('dist'))


// routes

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// gets Single entry route
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person){
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      console.error('error caught andcaused by=>', error)
      response.status(500).send({ 'error': 'malformatedid' })
    })
})

// Deleting a phone book entry
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      response.json(`the amount of persons in the phone book are ${count}, as of ${Date()}`)
    })
})

// reciving new number
app.post('/api/persons', (request, response, next) => {
  const name = request.body

  const details = new Person({
    name: name.name,
    number: name.number,
  })

  details.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => {
      if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message })
      } else {
        next(error)
      }
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const update = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, update, { new: true })
    .then(updated => {
      if (updated) {
        response.json(updated)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(err => {
      console.error('Error updating:', err)
      response.status(500).json({ error: 'Internal server error' })
    })
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)
// PORT defination

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
