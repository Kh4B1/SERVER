const multer = require('multer'),
  path = require('path')

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    req.fileValidationError = 'jpg,jpeg,png,gif,webp 파일만 업로드 가능합니다.'
    cb(null, false)
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, done) => {
      done(null, '../source/board-img')
    },
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname)
      const fileName = path.basename(file.originalname, ext) + Date.now() + ext
      done(null, fileName)
    },
  }),
  fileFilter: fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 },
})

module.exports = { upload }
