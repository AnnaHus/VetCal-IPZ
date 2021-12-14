
const express = require('express')
const path = require('path')
const session = require('express-session')
const app = express()
const port = process.env.PORT
const db = require('./models')
const UserController = require('./controllers/userController')
const AppController = require('./controllers/appController')

// Load middleware for parsing request and response body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for http request and response logging
const logHttp = (req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}]\"${req.method} ${req.originalUrl} HTTP/${req.httpVersion}\"\t${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`)
  })
  next()
}
app.use(logHttp)

// Add session middleware
var SequelizeStore = require("connect-session-sequelize")(session.Store);
var sessionStore = new SequelizeStore({ db: db })
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}))


// Routes
app.get('/', (req, res) => {
  if (!req.session.username) {
    res.sendStatus(401)
  } else {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
  }  
})

app.post('/register', async (req, res) => {
  console.log(req.body)
  const user = await UserController.findUser(req.body.username)
  console.log(user)
  if (!user) {
    UserController.createUser(req.body.username, req.body.password)
    res.status(200).send('OK')

  } else {
    res.status(200).send('User exists.')
  }
})

app.post('/login', async (req, res) => {
  const user = await UserController.findUser(req.body.username)
  if ((!user) || req.body.password != user.password) {
    res.sendStatus(401)
  } else {
    req.session.username = req.body.username
    res.redirect('/')
  }

})

app.get('/apps', async (req, res) => {
  const datum = req.query.date
  let apps
  if(datum){
    apps = await AppController.findApps(datum)
  } else {
    apps = await AppController.findAllApps()
  }

  res.status(200).send(apps)
})

app.post('/apps', async (req, res) => {
  await AppController.createApp(req.body.clientName, req.body.time, req.body.date, req.body.duration, req.body.optionalDesc)
  res.send("OK")
})

// Add static files
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.static(path.join(__dirname, '..', 'node_modules')))

// Function for starting database and server
const startServer = async () => {
  try {
    await db.sync()
    await db.authenticate()
    console.log('Succesfully connected to database.')
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

startServer()
