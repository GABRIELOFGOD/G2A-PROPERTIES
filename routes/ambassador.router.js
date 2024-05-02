const { registerAmbassador, getAllAmbassador } = require('../controller/ambassador.controller');
const { adminAuth, adminIdentifier } = require('../middleware/administration.middleware');

const router = require('express').Router()

router.post('/register', registerAmbassador)
router.get('/all', adminAuth, adminIdentifier, getAllAmbassador)

module.exports = router;