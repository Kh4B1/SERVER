const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  api = require('./api'),
  { sequelize } = require('./models'),
  fs = require('fs')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공')
  })
  .catch((err) => {
    console.error(err)
  })

app.use('/api', api)
app.get('/', (req, res) => res.send(`SERVER ON! PORT  : ${port}`))
const port = 8000
app.listen(port, () => {
  const dir = "./uploads"
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir)
  }
  console.log(`SERVER ON! PORT : ${port}`)
})
  

