const pool = require('../../config/database')

exports.newModule = (req, res) => {
  const param = req.param('name'),
    { id, email } = req.body.user
  pool((conn) => {
    const sql = 'insert into tbl_module(user_id, name) values(?,?)'
    conn.query(sql, [id, param], (err, doc) => {
      err ? res.send({ result: err, message: err }) : res.send({ result: true })
    })
    conn.release()
  })
}

exports.getModuleList = (req, res) => {
  const { id } = req.body.user
  pool((conn) => {
    const sql = 'select * from tbl_module where user_id = ?'
    conn.query(sql, [id], (err, row) => {
      if (err) res.send({ result: false, message: err })
      if (row) {
        res.send({ result: true, data: row })
      } else {
        res.send({ result: false })
      }
    })
    conn.release()
  })
}

exports.getModule = (req, res) => {
  const param = req.params.id
  pool((conn) => {
    const sql =
      'select u.name as userName, m.id as moduleId, m.name as moduleName, m.user_id as moduleUserId, a.user_id as accessUserId, a.id as accessId from tbl_module as m INNER JOIN tbl_access as a on m.id = a.module_id INNER JOIN tbl_user as u on a.user_id = u.id where m.id = 1'
    conn.query(sql, [param], (err, row) => {
      if (err) res.send({ result: false, message: err })
      if (row) res.send({ result: true, data: row })
    })
    conn.release()
  })
}
