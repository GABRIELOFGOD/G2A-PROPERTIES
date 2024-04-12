const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Realtor = require('../model/realtor.model')
const Admin = require('../model/administration.model')

const salt = number => bcrypt.genSalt(number)

const passwordHasher = (password, hash) => bcrypt.hash(password, hash)

const passwordCompare = (password, hashed) => bcrypt.compare(password, hashed)

const createdToken = id => {
  return(jwt.sign({id}, process.env.SECRET_KEY, { expiresIn: '3d' }))
}

const realtorPropertyAdder = (id, property) => Realtor.findByIdAndUpdate(id, {
  $addToSet: {properties: property}
})

const adminPropertyAdder = (id, property) => Admin.findByIdAndUpdate(id, {
  $addToSet: {properties: property}
})

module.exports = { passwordHasher, salt, passwordCompare, createdToken, realtorPropertyAdder, adminPropertyAdder }