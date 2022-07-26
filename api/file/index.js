const router = require('express').Router(),
file = require('./file.controller'),
upload = require('../../middlewares/multer').upload

router.post('/upload',upload.array('img'),file.upload)
router.post('/download',file.download)

module.exports = router
