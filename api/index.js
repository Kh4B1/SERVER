const router = require('express').Router(),
  auth = require('./auth'),
  board = require('./board'),
  modulePi = require('./module'),
  access = require('./access')

router.use('/board', board)
router.use('/auth', auth)
router.use('/module', modulePi)
router.use('/access', access)

module.exports = router
