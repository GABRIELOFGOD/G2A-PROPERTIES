const { createRealtor, loginRealtor } = require('../controller/realtor.controller')

const router = require('express').Router()

router.post('/register', createRealtor)
router.post('/login', loginRealtor)

module.exports = router