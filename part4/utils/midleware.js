const User = require("../models/user");
const logger = require('./logger')

const getTokenFrom = (request, response, next) => {
    const authorization = request.get('authorization')
  
    if(authorization && authorization.startsWith('Bearer ')){
      request.token = authorization.replace('Bearer', '')
    } else{
      request.token = null
    }
  
    next();
}

const userExtractor = async (request, response, next) => {
  try{
    const user = await User.findById(request.params.id)

    if(!user) {
      return response.status(404).json({ error: 'unknown user'})
    }
    request.user = user.name
    next()
  } catch (err) {
    logger.error(err)
    next()
  }
}

module.exports = {
  getTokenFrom,
  userExtractor
}