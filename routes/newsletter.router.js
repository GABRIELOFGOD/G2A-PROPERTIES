const { subscribeNewsletter, getAllNewsletter } = require('../controller/newsletter.controller')

const router = require('express').Router()

router.post('/subscribe', subscribeNewsletter)
router.route('/emails').get(getAllNewsletter)

module.exports = router;