const router = require('express').Router(),
  board = require('./board.controller'),
  jwt = require('../../middlewares/jwt')

router.post('/:id', jwt.check, board.newBoard)
router.get('/', board.getBoardList)
router.get('/search', board.searchBoard)
router.get('/:id', board.getBoard)

module.exports = router
