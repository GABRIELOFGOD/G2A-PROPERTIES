const { createRealtor } = require('../controller/realtor.controller')

const router = require('express').Router()

router.post('/register', createRealtor)

module.exports = router