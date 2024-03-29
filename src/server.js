const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const epilogue = require('epilogue')
const OktaJwtVerifier = require('@okta/jwt-verifier')

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '0oahd544mnInltxdb0h7',
  issuer: 'https://dev-119828.oktapreview.com/oauth2/default'
})

let app = express()
app.use(cors())
app.use(bodyParser.json())

// verify JWT token middleware
app.use((req, res, next) => {
  // require every request to have an authorization header
  if (!req.headers.authorization) {
    return next(new Error('Authorization header is required'))
  }
  let parts = req.headers.authorization.trim().split(' ')
  let accessToken = parts.pop()
  oktaJwtVerifier.verifyAccessToken(accessToken)
    .then(jwt => {
      req.user = {
        uid: jwt.claims.uid,
        email: jwt.claims.sub
      }
      next()
    })
    .catch(next) // jwt did not verify!
})

// For ease of this tutorial, we are going to use SQLite to limit dependencies
let database = new Sequelize({
  dialect: 'mysql',
  database: 'phonelist',
  username: 'root',
  password: 'Invent2017',
  port: 3306
})

// Define our PhoneUser model
let PhoneUser = database.define('phoneusers', {
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  department: Sequelize.STRING,
  title: Sequelize.STRING,
  email: Sequelize.STRING,
  extension: Sequelize.INTEGER,
  fax: Sequelize.STRING,
  cell: Sequelize.STRING
})

// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: database
})

// Create the dynamic REST resource for our PhoneUser model
let userResource = epilogue.resource({
  model: PhoneUser,
  endpoints: ['/phone-users', '/phone-users/:id']
})

// Resets the database and launches the express app on :8081
database
  .sync({ force: false })
  .then(() => {
    app.listen(8081, () => {
      console.log('listening to port localhost:8081')
    })
  })
