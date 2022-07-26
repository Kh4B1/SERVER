const router = require("express").Router(),
videoRouter = require("./videoRouter"),
videoUpload = require("./videoUpload")


router.post("/video", videoRouter.get)
router.post("/upload", videoUpload.post)

module.exports = router