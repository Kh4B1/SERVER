const pool = require("../../config/database"),
  bcrypt = require("bcryptjs"),
  nodemailer = require("nodemailer"),
  emailData = require("../../config/emailData"),
  jwt = require("jsonwebtoken"),
  secretKey = "Secret_Key"

exports.login = (req, res) => {
  console.log(req.body)
  const param = [req.body.email, req.body.pw],
    accessToken = jwt.sign({ id: param[0] }, secretKey, { expiresIn: "1h" })
  pool((conn) => {
    const sql = "select * from tbl_user where id = ?"
    conn.query(sql, param[0], (err, row) => {
      if (err) res.send({ result: false, message: err })
      if (row.length > 0) {
        bcrypt.compare(param[1], row[0].pw, (err, result) => {
          err && res.send({ result: false, message: err })
          if (result) {
            res.send({ result: true, token: accessToken })
          } else res.send({ result: false, message: "PW ERR" })
        })
      } else res.send({ result: false, message: "ERROR" })
    })
    conn.release()
  })
}

exports.register = (req, res) => {
  const { email, pw, name } = req.body
  bcrypt.hash(pw, 10, (err, hash) => {
    if (err) res.send({ result: false, message: err })
    pool((conn) => {
      const sql = "insert into tbl_user(email, name, pw) values(?,?,?)"
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
    service: "Naver",
    prot: 587,
    host: "smtp.naver.com",
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
    subject: "[ANYAD Sign Up Check Code]",
    text: `Your Code : ${checkCode}`,
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err)
    res.send({ code: checkCode })
  })
}
