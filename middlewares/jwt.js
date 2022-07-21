const jwt = require('jsonwebtoken'),
  secretKey = 'Secret_Key'

exports.check = (req, res, next) => {
  const token = req.headers.accesstoken
  console.log(token)

  const p = new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) reject(err)
      resolve(decoded)
    })
  })

  p.then((decoded) => {
    console.log(decoded)
    req.body.token = token
    req.body.user = decoded
    next()
  }).catch((err) => {
    res.send({
      success: false,
      message: err.message,
    })
  })
}
