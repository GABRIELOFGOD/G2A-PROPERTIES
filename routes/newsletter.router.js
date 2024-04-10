const { subscribeNewsletter } = require('../controller/newsletter.controller')

const router = require('express').Router()

router.post('/subscribe', subscribeNewsletter)

module.exports = router