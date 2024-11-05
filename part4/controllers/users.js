const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

// creating a new user
usersRouter.post('/', async(request, response) => {
    const {username, name, password } = request.body


    if(password.length !== 3){
        return response.status(400).json({error: "password must be more than 3 characters."})
    }

    const saltRounds = 10
    const PasswordHash = await bcrypt.hash(password, saltRounds)

    const user = new User ({
        username,
        name,
        PasswordHash,
    })
    try {
        const savedUser = await user.save()
    response.status(201).json(savedUser)
    } catch (error) {
        logger.error(error);
        response.status(400).json({error: "ussername should be unique"})
    }
})

//to see te list of all users
usersRouter.get('/', async(request, response) =>{
    const users = await User
    .find({}).populate('blogs')

    response.json(users)
})

module.exports = usersRouter