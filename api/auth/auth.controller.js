const { param } = require('.')

const pool = require('../../config/database'),
  bcrypt = require('bcryptjs'),
  nodemailer = require('nodemailer'),
  emailData = require('../../config/emailData'),
  jwt = require('jsonwebtoken'),
  secretKey = 'Secret_Key'

exports.login = (req, res) => {
  const param = [req.body.email, req.body.pw],
    accessToken = jwt.sign({ id: param[0] }, secretKey, { expiresIn: '1h' })
  pool((conn) => {
    const sql = 'select * from tbl_user where email = ?'
    conn.query(sql, param[0], (err, row) => {
      if (err) res.send({ result: false, message: err })
      if (row.length > 0) {
        bcrypt.compare(param[1], row[0].pw, (err, result) => {
          err && res.send({ result: false, message: err })
          if (result) {
            res.send({ result: true, token: accessToken })
          } else res.send({ result: false, message: 'PW ERR' })
        })
      } else res.send({ result: false, message: 'ERROR' })
    })
    conn.release()
  })
}

exports.register = (req, res) => {
  const { email, pw, name } = req.body
  console.log(email)
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

exports.pwReset = (req, res) => {

  const param = [req.body.pw, req.body.email]
  const randPw = String(emailData.number())
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
    to: param[1],
    subject: "[ANYAD PassWord Change]",
    text: `Your PassWord : ${randPw}`,
  }

  bcrypt.hash(randPw, 10, (err, hash) => {
    if (err) res.send({ result: false, message: err })
    param[0] = hash
    pool((conn) => {
      const sqlEmail = "select * from tbl_user where email = ?"
      const sqlPw ="update tbl_user set pw = ? where email = ? "
      conn.query(sqlEmail, param[1], (err, accord) => {
        if (err) res.send({ result: false })
        if (accord.length > 0) {
          conn.query(sqlPw, param, (err, row) => {
            if (err) {
              res.send({ result: false })
            }
            if (row) {
              transporter.sendMail(mailOptions, (err, info) => {
                if (err) res.send({ result: "sendErr" })
                res.send({ result : true })
                conn.release()
              })
            } else {
              res.send({ result: false })
            }
          })
        }
        else {
          res.send({result:false, message :  "해당 이메일은 가입되지 않았습니다."})
        }
      })
      conn.release()
    })
  })
}

exports.pwChange = (req, res) => {
  const param = [req.body.pw, req.body.user.id];
  bcrypt.hash(param[0], 10, (err, hash) => {
    if (err) res.send({ result: false, message: "bcrypt 오류" })
    param[0] = hash
    pool((conn) => {
      const sql = 'update tbl_user set pw = ? where id = ?';
      conn.query(sql, param, (err, row) => {
        if (err) {
          res.send({ result: "update err", message: "sql문 오류" })
        }
        if (row) {
          res.send({ result: "true" })
        } else {
          res.send({ result: "false" })
        }
      })
      conn.release()
    })
  })
}


// exports.pwCheck = (req,res) => {
//   const param = [req.body.id,req.body.pw]
//   bcrypt.hash(param[1],10,(err,hash) => {
//     if(err) res.send({result:false,message:"bcrypt 오류"})
//     param[1] = hash
//     pool((conn) => {
//       const sql = "select * from tbl_user where id = ?"
//       conn.query(sql,param[0],(err,row)=>{
//         if(err) res.send({result : false})
//         if(row) { 
//           res.send({result : true})
//           console.log(param[0])
//         }
//         else {
//           res.send({result : false})
//         }
//       })
//     })     
//   })
// } 

// exports.pwCheck = (req,res) => {
//   const id = req.body.id
//     pool((conn) => {
//       const sql = "select * from tbl_user where id = ?"
//       conn.query(sql,id,(err,row) => {
//         if(err) res.send({result : false})
//         if(row) { 
//           res.send({result : true})
//           console.log(id)
//         }
//         else {
//           res.send({result : false})
//         }
//       })
//     })     
//   }
