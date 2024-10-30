const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { response, request } = require('../app')

usersRouter.post('/', async(request, response) => {
    const {username, name, password } = request.body

    const saltRounds = 10
    const PasswordHash = await bcrypt.hash(password, saltRounds)

    const user = new User ({
        username,
        name,
        PasswordHash,
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

usersRouter.get('/', async(request, response) =>{
    const user = await User.find({})
    response.json(user)
})
module.exports = usersRouter