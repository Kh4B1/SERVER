const models = require('../../models')

exports.getAccessList = async (req, res) => {
  const { id } = req.body.user
  try {
    const data = await models.Access.findAll({ where: { user_id: 1 } })
    res.json({ result: true, data: data })
  } catch (err) {
    console.log(err)
  }
}

exports.getAccess = async (req, res) => {
  const param = req.params.id
  try {
    const data = await models.Access.findAll({ where: { id: id } })
    res.json({ result: true, data: data })
  } catch (err) {
    console.log(err)
  }
}
