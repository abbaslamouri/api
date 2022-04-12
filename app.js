const path = require('path')
const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const cors = require('cors')
const hpp = require('hpp')
const morgan = require('morgan')
// const session = require('express-session')
// const MongoStore = require('connect-mongo')
// const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const AppError = require('./utils/AppError')
const errorHandler = require('./utils/errorHandler')

const tourRouter = require('./routes/tours')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/users')
const reviewRouter = require('./routes/reviews')
const mediaRouter = require('./routes/media')
const categoryRouter = require('./routes/categories')
const productRouter = require('./routes/products')
const variantRouter = require('./routes/variants')
const attributeRouter = require('./routes/attributes')
const attributetermRouter = require('./routes/attributeterms')
const orderRouter = require('./routes/orders')
const countryRouter = require('./routes/countries')
const stateRouter = require('./routes/states')

const app = express()
app.use(cors())

app.use(helmet())

app.use(express.json({ limit: '1000kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(
  fileUpload({
    limits: 2 * 1024 * 1024,
  })
)

app.use(express.static(path.join(__dirname, 'public')))

// app.use(cookieParser())

if (process.env.NODE_ENV == 'development') app.use(morgan('dev'))
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// Data sanitization against noSQL query injection
app.use(mongoSanitize())

// Data sanitization against xss
app.use(xss())

// Prevent HTTP parameter polution
app.use(hpp({ whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'price', 'difficulty'] })) // <- THIS IS THE NEW LINE

const limitter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100000, // limit each IP to 100 requests per windowMs
  message: 'Too many attempts from this IP, please try again after an hour',
})
app.use('/api', limitter)

// app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/media', mediaRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/variants', variantRouter)
app.use('/api/v1/attributes', attributeRouter)
app.use('/api/v1/attributeterms', attributetermRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/countries', countryRouter)
app.use('/api/v1/states', stateRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(errorHandler)

module.exports = app
