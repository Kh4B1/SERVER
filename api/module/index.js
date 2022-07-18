const router = require('express').Router(),
  modulePi = require('./module.controller'),
  jwt = require('../../middlewares/jwt')

router.get('/', jwt.check, modulePi.getModuleList)
router.get('/:id', modulePi.getModule)
router.get('/new', jwt.check, modulePi.newModule)

module.exports = router
