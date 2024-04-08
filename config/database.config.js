const mongoose = require('mongoose')

const databaseConnection = () => {
  const conn = mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log('error connecting to database', err))
}

module.exports = databaseConnection