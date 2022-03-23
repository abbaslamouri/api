const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

process.on('uncaughtException', (err) => {
  console.log(err)
  console.log('ERROR', err.name, err.message)
  console.log('UNCAUGHT EXCEPTION, Server shutting down')
  process.exit(1)
})

dotenv.config({ path: './config.env' })

const app = require('./app')

const db = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD)
mongoose
  .connect(db, {})
  .then(() => {
    console.log(colors.magenta.bold(`Database connection succesfull`))
  })
  .catch((err) => {
    console.log(colors.red.bold('Mongo DB Error', err))
    console.log(colors.red.bold('Mongo DB Error Message', err.message))
  })

const port = process.env.PORT || 8000
const server = app.listen(port, 'localhost', () => {
  console.log(`server running on port ${port}...`.cyan.bold)
})


process.on('unhandledRejection', (err, promise) => {
  console.log('ERROR', err.name, err.message)
  console.log('UNHANDLED REJECTION, Server shutting down')
  server.close(() => {
    process.exit(1)
  })
})
