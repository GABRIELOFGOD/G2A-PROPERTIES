const { createRealtor, loginRealtor, changeRealtorStatus, realtorForgotPassword, realtorProfile, updateRealtorPassword } = require('../controller/realtor.controller')
const { adminAuth, adminIdentifier } = require('../middleware/administration.middleware')
const { realtorAuthouriser, realtorIdentifier } = require('../middleware/realtor.middleware')

const router = require('express').Router()

router.post('/register', createRealtor)
router.post('/login', loginRealtor)
router.route('/change/:id').put(adminAuth, adminIdentifier, changeRealtorStatus)
router.post('/forgot_password', realtorForgotPassword)
router.route('/profile').get(realtorProfile)
router.put('/change_password/:token', updateRealtorPassword)

module.exports = router