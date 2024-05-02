const { fillContact, getAllContactInfo } = require('../controller/contact.controller')
const { adminAuth, adminIdentifier } = require('../middleware/administration.middleware')

const router = require('express').Router()

router.post('/fill', fillContact)
router.get('/all', adminAuth, adminIdentifier, getAllContactInfo)

module.exports = router