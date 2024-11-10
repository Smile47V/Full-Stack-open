require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const midleware = require('./utils/midleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// Use JSON middleware
app.use(express.json())

// Morgan token configuration for logging request body
morgan.token('body', (req) => {
    return JSON.stringify(req.body) // log the request body
})

// Apply morgan and CORS middleware
app.use(morgan(':method :url :status :body - :response-time ms'))
app.use(cors())
app.use(midleware.getTokenFrom)
app.use(midleware.userExtractor)

// Define route for blogs
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Mongoose strict query option
mongoose.set('strictQuery', false)

// Choose the MongoDB URI based on the environment (development or test)
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_TEST // Use test database URI if running tests
    : process.env.MONGODB_URI      // Use default URI for development/production

logger.info(`Connecting to ${process.env.NODE_ENV === 'test' ? 'test' : 'development'} MongoDB`)

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error.message)
    })

module.exports = app
