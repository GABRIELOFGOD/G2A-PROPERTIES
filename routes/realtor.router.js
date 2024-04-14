const { createRealtor, loginRealtor, changeRealtorStatus, realtorForgotPassword } = require('../controller/realtor.controller')
const { adminAuth, adminIdentifier } = require('../middleware/administration.middleware')

const router = require('express').Router()

router.post('/register', createRealtor)
router.post('/login', loginRealtor)
router.route('/change/:id').put(adminAuth, adminIdentifier, changeRealtorStatus)
router.post('/forgot_password', realtorForgotPassword)

module.exports = router