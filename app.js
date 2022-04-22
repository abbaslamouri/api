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
const stripe = require('stripe')(process.env.STRIPE_SK)

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
const corsOptions = {
  // origin: 'http://localhost:4000',
  // credentials: true, //access-control-allow-credentials:true
  // optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(helmet())

// app.use(express.json({ limit: '1000kb' }))
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

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/orders/webhook') {
    next()
  } else {
    express.json({ limit: '1000kb' })(req, res, next)
  }
})

// Prevent HTTP parameter polution
app.use(hpp({ whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'price', 'difficulty'] })) // <- THIS IS THE NEW LINE

const limitter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100000, // limit each IP to 100 requests per windowMs
  message: 'Too many attempts from this IP, please try again after an hour',
})
app.use('/api', limitter)

// const endpointSecret = process.env.STRIPE_WSK
// app.post('/api/v1/orders/webhook', express.raw({ type: 'application/json' }), (req, res) => {
//   let event = req.body
//   console.log('REQBODY', req.body)
//   console.log('REQHEADERS', req.headers)

//   if (endpointSecret) {
//     // Get the signature sent by Stripe
//     const signature = req.headers['stripe-signature']
//     try {
//       event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret)
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message)
//       return res.sendStatus(400)
//     }
//   }

//   // Handle the event
//   let paymentIntent = null
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       paymentIntent = event.data.object
//       console.log(`[${event.id}] PaymentIntent for ${paymentIntent.amount} was successful!`)
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break

//     case 'payment_intent.created':
//       paymentIntent = event.data.object
//       console.log(`[${event.id}] PaymentIntent for ${paymentIntent.amount} was successful!`)
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break

//     case 'payment_intent.processing':
//       paymentIntent = event.data.object
//       console.log(`[${event.id}] PaymentIntent for ${paymentIntent.amount} was successful!`)
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break

//     case 'payment_method.attached':
//       const paymentMethod = event.data.object
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`)
//   }

//   res.send()
// })

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

app.get('/favico.ico', (req, res) => {
  res.sendFile('myfavico.ico')
})

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(errorHandler)

module.exports = app
