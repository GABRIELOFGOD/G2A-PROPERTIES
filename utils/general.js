const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const salt = number => bcrypt.genSalt(number)

const passwordHasher = (password, hash) => bcrypt.hash(password, hash)

const passwordCompare = (password, hashed) => bcrypt.compare(password, hashed)

const createdToken = id => {
  return(jwt.sign({id}, process.env.SECRET_KEY, { expiresIn: '3d' }))
}

module.exports = { passwordHasher, salt, passwordCompare, createdToken }