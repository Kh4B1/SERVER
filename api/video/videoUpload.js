//const models = require('../../models')
const multiparty = require("multiparty")
const url = require("url")
const fs = require("fs")


exports.post("/", (req, res) => {
    const form = new multiparty.Form()
    form.on("error", (err) => res.status(500).end())
    form.on("part", (part) => {
      // file이 아닌 경우 skip
      if (!part.filename) return part.resume()
        
      const filestream = fs.createWriteStream(`./source/video/${part.filename}`)
      part.pipe(filestream)
    })
    
    var time = new Date()
    var hour = time.getHours()
    var minute = time.getMinutes()

    var filename = part.filename + hour + minute
    fs.rename(`${part.filename}`, `${filename}`, function(err){
        if( err ) throw err
        console.log()
    })
    form.on("close", () => res.end())
    form.parse(req)
  })

var sql = `INSERT INTO tbl_video (path) VALUES('./source/video/${filename}')`
conn.query(sql, function(err, rows, fields){
    if(err) console.log(err)
});

