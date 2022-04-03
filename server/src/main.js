const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const app = express()
const jwt = require("jsonwebtoken")
const { required } = require('nodemon/lib/config')
const winston = require('winston')
const expressWinston = require('express-winston')
const mysql = require('mysql')
const res = require('express/lib/response')
const port = 8000

const TOKEN_SECRET = '26940dd014d5bfe15e9b9f1a9e6441471cd018786ebbc0406f26cb3033f1c1b04b55726f045b44630140d2161ab0131f4da7c1b506d7df81e866e0eb8b625ab1'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}))

const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'results.log');

const logger = createLogger({
  // change level if in dev environment versus production
  level: env === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    new transports.File({ filename })
  ]
});


//homepage
app.get('/', (req, res) => {
  res.send('Welcome')
})

/*app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: false,
  msg: "HTTP  ",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));*/

app.use(cors())

const authenticated = (req, res, next)=>{
  const auth_header = req.headers['authorization']
  const token = auth_header && auth_header.split(' ')[1]
  console.log(token)
  if(!token)
    return res.sendStatus(401)
  jwt.verify(token, TOKEN_SECRET, (err, info) => {
    if(err) return res.sendStatus(403)
    req.username = info.username
    next()
  })
}

app.get('/api/info', authenticated, (req, res)=>{
  res.send({ok: 1,username: req.username})
})

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
  console.log(result.data)
  res.send({ok:1})
})

//connection to mysql database
let dbCon = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database:  'staff'
})
dbCon.connect();

//get all staffs
app.get('/staffs',(req, res) => {
  dbCon.query('SELECT * FROM staffs',(error, results, fields)=>{
    if(error) throw error

    let massage =""
    if(results === undefined || results.length == 0){
      logger.warn('Staff table is empty');
    }else {
      logger.info('Successful get all staff');
    }
    
    res.send({error: false, data: results})
  })
})

//add staff
app.post('/staff',(req, res) => {
  let name = req.body.name;
  let team = req.body.team;

  if(!name || !team){
    res.status(400).send({message : "Please input all info."})
    logger.error("Incomplete information");
  }else{
    dbCon.query('INSERT INTO staffs (name, team) VALUES(?,?)', [name, team],(error,results,fields)=>{
      if(error) throw error;

      logger.info("sussessfuly added");

      return res.send({ error: false, data: results, message: "successfully added"})
    })
  }

})

//delete staff 
app.delete('/staff/:id',(req,res)=>{
  let id = req.params.id
  
    dbCon.query('DELETE FROM staffs WHERE id = ?',[id],(error, results, fields)=>{
      if(error) throw error

      logger.info("sussessfuly deleted");
    
      res.send({error: false, data: results,message: "sussessfuly deleted"})
    })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})