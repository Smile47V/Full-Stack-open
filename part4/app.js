require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const  mongoose = require('mongoose')

app.use(express.json())

morgan.token('body', (req) => {
    return JSON.stringify(req.body) // a configured morgan function to keep tab logs
})

app.use(morgan(':method :url :status :body - :response-time ms')) // this adds the morgan functionto the app
app.use(cors())

app.use('/api/blogs', blogsRouter)


//mongoose use
mongoose.set('strictQuery', false)

logger.info(`conecting to`, process.env.MONGODB_URI)


// conecting to mogoose
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    logger.info("connected to MongoDB")
})
.catch((error) =>{
    logger.error("erro connecting to MongoDB", error.message)
})

module.exports = app