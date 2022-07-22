const router = require('express').Router(),
  board = require('./board.controller'),
  jwt = require('../../middlewares/jwt'),
  { upload } = require('../../middlewares/multer')

router.post('/', upload.array('img'), board.newBoard)
router.get('/', board.getBoardList)
router.get('/search', () => board.search)
router.get('/:id', board.getBoard)

module.exports = router
