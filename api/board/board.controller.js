const models = require('../../models')

exports.getBoardList = async (req, res) => {
  try {
    const data = await models.Board.findAll()
    data ? res.json({ result: true, data: data }) : res.json({ result: false })
  } catch (err) {
    console.log(err)
  }
}

exports.getBoard = async (req, res) => {
  const { id } = req.params
  console.log(id)
  try {
    const data = await models.Board.findOne({ where: { id: id } })
    data ? res.json({ result: true, data: data }) : res.json({ result: false })
  } catch (err) {
    console.log(err)
  }
}

exports.searchBoard = async (req, res) => {
  const { keyword } = req.query

  try {
    const data = await models.Board.findAll({ where: { title: keyword } })
    data ? res.json({ result: true, data: data }) : res.json({ result: false })
  } catch (err) {
    console.log(err)
  }
}

exports.newBoard = async (req, res) => {
  const { id } = req.body.user,
    mid = req.params.id
  const { title, text, price } = req.body
  try {
    await models.Board.create({
      title: title,
      text: text,
      price: price,
      user_id: id,
      module_id: mid,
    })
    res.json({ result: true })
  } catch (err) {
    console.log(err)
  }
}
