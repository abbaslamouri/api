import mongoose from 'mongoose'
import session from 'express-session'
const MongoStore = require('connect-mongo')(session)
import colors from 'colors'
import 'dotenv/config'
import app from './app'

// new MongoStore(session)

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1 * 60 * 1000 },
  })
)
// type junk = 35 | string | { [foo: string | number]: string } | Record<'foo' | 'bar', string>
// const x: junk
// const dotenv = require('dotenv')

// process.on('uncaughtException', (err) => {
//   console.log(err)
//   console.log('ERROR', err.name, err.message)
//   console.log('UNCAUGHT EXCEPTION, Server shutting down')
//   process.exit(1)
// })

// dotenv.config({ path: './config.env' })

// if (process.env.DB_URL === undefined) {
//   throw Error('DB_URL undefined')
// }
const db = (process.env.DB_URL as string).replace('<PASSWORD>', process.env.DB_PASSWORD as string)
const connection = mongoose
  .connect(db, {})
  .then(() => {
    console.log(colors.magenta.bold(`Database connection succesfull`))
  })
  .catch((err: Error) => {
    console.log(colors.red.bold(`Mongo DB Error ${err}`))
    console.log(colors.red.bold(`Mongo DB Error Message ${err.message}`))
  })

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'session',
})

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1 * 60 * 1000 },
  })
)

const port = process.env.PORT || 8000
const server = app.listen(port, 'localhost', () => {
  console.log(colors.cyan.bold(`server running on port ${port}...`))
})

// process.on('unhandledRejection', (err:Error, promise) => {
//   console.log(`ERROR ${err.name} ${err.message}`)
//   console.log('UNHANDLED REJECTION, Server shutting down')
//   server.close(() => {
//     process.exit(1)
//   })
// })
