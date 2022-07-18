const router = require('express').Router(),
  access = require('./access.controller'),
  jwt = require('../../middlewares/jwt')

router.get('/', jwt.check, access.getAccessList)
router.get('/:id', access.getAccess)

module.exports = router
