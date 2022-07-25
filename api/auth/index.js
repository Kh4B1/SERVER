const router = require('express').Router(),
  auth = require('./auth.controller')

router.post('/', auth.login)
router.post('/register', auth.register)
router.post('/check', auth.checkEmail)
router.post('/pwreset', auth.pwreset)

module.exports = router
