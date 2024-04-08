const validator = require('validator')

const emailValidator = email => validator.isEmail(email)

const phoneValidator = phone => validator.isMobilePhone(phone)

const passwordValidator = password => validator.isStrongPassword(password)

module.exports = { emailValidator, phoneValidator, passwordValidator }