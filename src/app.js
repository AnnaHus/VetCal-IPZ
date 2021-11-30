
const express = require('express')
const path = require('path')
const session = require('express-session')
const app = express()
const port = process.env.PORT
const db = require('./models')
// const UserController = require('./controllers/userController')
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

// Add static files
app.use(express.static(path.join(__dirname, '..', 'public')))

// Routes
app.get('/', (req, res) => {
  // TODO login
  /* if (!req.session.username) {
    res.redirect('/login')
  } else {
    res.redirect('/apps')
  } */

  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

app.get('/app', async (req, res) => {
const apps = await AppController.findApps()
res.status(200).send(apps)
})

app.post('/app', async (req, res) => {
  await AppController.createApp(req.body.ownerName, req.body.petName, req.body.petSpec, req.body.date)
  res.send("OK")
})

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
