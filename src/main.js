const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({extended: false}))
app.use('/static', express.static('public'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/addg', (req, res) => {
    let a = parseInt(req.query.a)
    let b = parseInt(req.query.b)
    res.send(' ' + (a + b))
  })

  app.post('/addg', (req, res) => {
    let a = parseInt(req.body.a)
    let b = parseInt(req.body.b)
    res.send(' ' + (a + b))
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})