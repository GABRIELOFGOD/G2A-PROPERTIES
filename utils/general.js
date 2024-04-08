const bcrypt = require('bcrypt')

const salt = number => bcrypt.genSalt(number)
const passwordHasher = (password, hash) => bcrypt.hash(password, hash)

module.exports = { passwordHasher, salt }