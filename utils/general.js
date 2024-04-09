const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Realtor = require('../model/realtor.model')

const salt = number => bcrypt.genSalt(number)

const passwordHasher = (password, hash) => bcrypt.hash(password, hash)

const passwordCompare = (password, hashed) => bcrypt.compare(password, hashed)

const createdToken = id => {
  return(jwt.sign({id}, process.env.SECRET_KEY, { expiresIn: '3d' }))
}

const propertyAdder = (id, property) => Realtor.findByIdAndUpdate(id, {
  $addToSet: {properties: property}
})

module.exports = { passwordHasher, salt, passwordCompare, createdToken, propertyAdder }