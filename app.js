const path = require('path')
const express = require('express')
const colors = require('colors')
// const rateLimit = require('express-rate-limit')
// const helmet = require('helmet')
// const mongoSanitize = require('express-mongo-sanitize')
// var xss = require('xss-clean')
// const hpp = require('hpp')
const morgan = require('morgan')
var cookieParser = require('cookie-parser')

const tourRouter = require('./routes/tours')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/users')

// const reviewRouter = require('./routes/reviewRoutes')
// const viewRouter = require('./routes/viewRoutes')
const AppError = require('./utils/AppError')
const errorHandler = require('./utils/errorHandler')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

// app.set('view engine', 'pug')
// app.set('views', path.join(__dirname, 'views'))

// app.use(helmet())

app.use(express.json({ limit: '10kb' }))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

if (process.env.NODE_ENV == 'development') app.use(morgan('dev'))

// Data sanitization against noSQL query injection
// app.use(mongoSanitize())

// Data sanitization against xss
// app.use(xss())

// Prevent HTTP parameter polution
// app.use(hpp({ whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'price', 'difficulty'] })) // <- THIS IS THE NEW LINE

// const limitter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many attempts from this IP, please try again after an hour',
// })
// app.use('/api', limitter)

app.use(cookieParser())

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString()
//   // console.log('COOKIES', req.cookies)
//   next()
// })

// app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/auth', authRouter)
// app.use('/api/v1/users', userRouter)
// app.use('/api/v1/reviews', reviewRouter)

// app.get('/api/v1/tours', (req, res) => {
//   res.end('Works')
// })

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(errorHandler)

// const port = 8000

// app.listen(port, () => {
//   console.log(`App running on part ${port}`.magenta)
// })

module.exports = app
