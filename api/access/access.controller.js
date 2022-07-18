const pool = require('../../config/database')

exports.getAccessList = (req, res) => {
  const { id } = req.body.user
  pool((conn) => {
    const sql = 'select * from tbl_access where user_id = ?'
    conn.query(sql, [id], (err, row) => {
      if (err) res.send({ result: false, message: err })
      if (row) res.send({ result: true, data: row })
    })
    conn.release()
  })
}

exports.getAccess = (req, res) => {
  const param = req.params.id
  pool((conn) => {
    const sql = 'select * from tbl_access where id = ?'
    conn.query(sql, [param], (err, row) => {
      if (err) res.send({ result: false, message: err })
      if (row) res.send({ result: true, data: row })
    })
    conn.release()
  })
}
