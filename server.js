const mongoose = require('mongoose')
// const session = require('express-session')
// const MongoStore = require('connect-mongo')
const colors = require('colors')
require('dotenv').config()
const app = require('./app')
console.log(process.env.JWT_SECRET)

// new MongoStore(session)

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
const db = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD)
const connection = mongoose
  .connect(db, {})
  .then(() => {
    console.log(colors.magenta.bold(`Database connection succesfull`))
  })
  .catch((err) => {
    console.log(colors.red.bold(`Mongo DB Error ${err}`))
    console.log(colors.red.bold(`Mongo DB Error Message ${err.message}`))
  })

// const sessionStore = new MongoStore({
//   mongooseConnection: connection,
//   collection: 'session',
// })

// app.use(
//   session({
//     secret: process.env.JWT_SECRET,
//     // resave: false,
//     // saveUninitialized: true,
//     cookie: { maxAge: 1 * 60 * 1000 },
//     store: MongoStore.create({})
//   })
// )

// const sessionStore = new MongoStore({
//   mongooseConnection: connection,
//   collection: 'junk',
// })

// app.use(
//   session({
//     saveUninitialized: true, // don't create session until something stored
//     resave: true, //don't save session if unmodified
//     secret: 'process.env.JWT_SECRET',
//     cookie: {
//       maxAge: 1 * 60 * 1000,
//     },
//     store: MongoStore.create({
//       mongoUrl: process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD),
//       // ttl: 14 * 24 * 60 * 60, // = 14 days. Default
//       // collectionName: 'junk',
//     }),
//   })
// )

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
