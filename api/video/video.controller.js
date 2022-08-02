const models = require("../../models"),
  fs = require("fs")

exports.upload = async (req, res) => {
  const { id: user_id } = req.body.user,
    { id: access_id } = req.params,
    { filename } = req.file
  try {
    await models.Video.create({
      user_id: user_id,
      access_id: access_id,
      path: filename,
    })
    console.log(1)
    res.json({ result: true })
  } catch (err) {
    console.log(err)
  }
}

exports.stream = async (req, res) => {}
