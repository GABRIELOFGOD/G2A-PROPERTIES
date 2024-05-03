const { adminRegistration, adminLogin, adminProfile, updateAdminData, logoutAdmin, adminById } = require('../controller/administration.controller')
const { adminAuth, adminIdentifier } = require('../middleware/administration.middleware')

const router = require('express').Router()

// router.post('/register', adminAuth, adminIdentifier, adminRegistration)
router.post('/login', adminLogin)
router.get('/logout', logoutAdmin)
router.route('/single').get(adminProfile).put(updateAdminData)
router.get('/details/:id', adminAuth, adminIdentifier, adminById)

module.exports = router