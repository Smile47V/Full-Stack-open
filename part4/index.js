const app = require('./app')
require('dotenv').config()
const logger = require('./utils/logger')



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  logger.info(`Server runin on ${PORT}`)
})