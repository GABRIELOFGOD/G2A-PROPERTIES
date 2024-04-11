const { fillContact } = require('../controller/contact.controller')

const router = require('express').Router()

router.post('/fill', fillContact)

module.exports = router