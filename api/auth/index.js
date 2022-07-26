const router = require('express').Router(),
  auth = require('./auth.controller')

const upload = require('../../middlewares/multer').upload

router.post('/', auth.login)
router.post('/register', auth.register)
router.post('/check', auth.checkEmail)
router.post('/pwreset', auth.pwreset)
router.post("/pwchange", auth.pwChange)
router.post('/upload',upload.array("img"),auth.upload)

module.exports = router
