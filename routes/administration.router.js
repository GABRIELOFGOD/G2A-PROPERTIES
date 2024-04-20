const { adminRegistration, adminLogin, adminProfile } = require('../controller/administration.controller')

const router = require('express').Router()

router.post('/register', adminRegistration)
router.post('/login', adminLogin)
router.route('/single').get(adminProfile)

module.exports = router