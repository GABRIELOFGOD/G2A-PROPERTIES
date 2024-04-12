const { adminRegistration, adminLogin } = require('../controller/administration.controller')

const router = require('express').Router()

router.post('/register', adminRegistration)
router.post('/login', adminLogin)

module.exports = router