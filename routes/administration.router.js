const { adminRegistration, adminLogin, adminProfile, updateAdminData } = require('../controller/administration.controller')
const { adminAuth, adminIdentifier } = require('../middleware/administration.middleware')

const router = require('express').Router()

// router.post('/register', adminAuth, adminIdentifier, adminRegistration)
router.post('/login', adminLogin)
router.route('/single').get(adminProfile).put(updateAdminData)

module.exports = router