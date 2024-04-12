const { createRealtor, loginRealtor, changeRealtorStatus } = require('../controller/realtor.controller')
const { adminAuth, adminIdentifier } = require('../middleware/administration.middleware')

const router = require('express').Router()

router.post('/register', createRealtor)
router.post('/login', loginRealtor)
router.route('/change/:id').put(adminAuth, adminIdentifier, changeRealtorStatus)

module.exports = router