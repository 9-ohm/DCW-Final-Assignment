const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(cors())

app.post('/api/login', bodyParser.json(), async (req, res)=>{
    let token = req.body.token
    let result = await axios.get('https://graph.facebook.com/me',{
        params: {
            fields: 'id,name,email',
            access_token: token
        }
    })
    console.log(result.data)
    res.send({ok: 1})

})
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})