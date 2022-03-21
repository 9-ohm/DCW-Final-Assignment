const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = 3000

const TOKEN_SECRET = '62378da13d281d6e1cf0c59440af4e660d079107487237677ec570c11c2415310e1d9fde642e31d0aaaa71ff495a14936d851b0c358abd07c5f9d0703ebea5f4'

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
    if(!result.data.id){
      res.sendStatus(403)
      return
    }
    let data = {
      username: result.data.email
    }
    let access_token = jwt.sign(data, TOKEN_SECRET, {expiresIn: '1800s'})
    res.send({access_token, username: data.username})
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})