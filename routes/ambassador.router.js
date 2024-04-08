const { registerAmbassador } = require('../controller/ambassador.controller');

const router = require('express').Router()

router.post('/register', registerAmbassador)

module.exports = router;