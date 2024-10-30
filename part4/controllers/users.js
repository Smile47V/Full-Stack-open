const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { response } = require('../app')

usersRouter.post('/', async(request, response))