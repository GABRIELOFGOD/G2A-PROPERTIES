const { realtorAuthouriser, realtorIdentifier } = require('../middleware/realtor.middleware')
const { postProperty } = require('../controller/property.controller')

const router = require('express').Router()

router.post('/post', realtorAuthouriser, realtorIdentifier, postProperty)

module.exports = router