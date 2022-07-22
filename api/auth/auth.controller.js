const pool = require('../../config/database'),
  bcrypt = require('bcryptjs'),
  nodemailer = require('nodemailer'),
  emailData = require('../../config/emailData'),
  jwt = require('jsonwebtoken'),
  secretKey = 'Secret_Key'

exports.login = (req, res) => {
  const param = [req.body.email, req.body.pw]
  pool((conn) => {
    const sql = 'select * from tbl_user where email = ?'
    conn.query(sql, param[0], (err, row) => {
      if (err) res.send({ result: false, message: err })
      if (row.length > 0) {
        const accessToken = jwt.sign(
          { email: row[0].email, id: row[0].id },
          secretKey,
          { expiresIn: '1h' },
        )
        bcrypt.compare(param[1], row[0].pw, (err, result) => {
          err && res.send({ result: false, message: err })
          if (result) {
            res.send({
              result: true,
              token: accessToken,
              info: { id: row[0].email, name: row[0].name, key: row[0].id },
            })
          } else res.send({ result: false, message: 'PW ERR' })
        })
      } else res.send({ result: false, message: 'ERROR' })
    })
    conn.release()
  })
}

exports.register = (req, res) => {
  const { email, pw, name } = req.body
  bcrypt.hash(pw, 10, (err, hash) => {
    if (err) res.send({ result: false, message: err })
    pool((conn) => {
      const sql = 'insert into tbl_user(email, name, pw) values(?,?,?)'
      conn.query(sql, [email, name, hash], (err, result) => {
        err
          ? res.send({ result: false, message: err })
          : res.send({ result: true })
      })
      conn.release()
    })
  })
}

exports.checkEmail = async (req, res) => {
  const checkCode = String(emailData.number())
  const transporter = nodemailer.createTransport({
    service: 'Naver',
    prot: 587,
    host: 'smtp.naver.com',
    secure: false,
    requireTLS: true,
    auth: {
      user: emailData.user,
      pass: emailData.pw,
    },
  })

  const mailOptions = {
    from: emailData.user,
    to: req.body.email,
    subject: '[ANYAD Sign Up Check Code]',
    text: `Your Code : ${checkCode}`,
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err)
    res.send({ code: checkCode })
  })
}

exports.pwreset = (req, res) => {
  const email = req.body.email
  const randPw = String(emailData.number())
  bcrypt.hash(randPw, 10, (err, hash) => {
    if (err) res.send({ result: false, message: err })
    pool((conn) => {
      const sqlPw =
        'update tbl_user set pw = ? where email = ' +
        conn.escape('' + email + '')
      conn.query(sqlPw, hash, (err, row) => {
        if (err) {
          res.send({ result: 'update err' })
        }
        if (row) {
          res.send({ result: randPw })
        } else {
          res.send({ result: 'false' })
        }
      })
    })
  })

  const transporter = nodemailer.createTransport({
    service: 'Naver',
    prot: 587,
    host: 'smtp.naver.com',
    secure: false,
    requireTLS: true,
    auth: {
      user: emailData.user,
      pass: emailData.pw,
    },
  })

  const mailOptions = {
    from: emailData.user,
    to: email,
    subject: '[ANYAD PassWord Change]',
    text: `Your PassWord : ${randPw}`,
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) res.send({ result: 'sendErr' })
    res.send({ code: randPw })
  })
}
