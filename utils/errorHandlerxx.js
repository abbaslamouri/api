import colors from 'colors'

export default (error) => {
  // console.log(colors.red.bold('ERR', error.message))
  let statusCode = 200
  let message = ''

  // Mongoose validation error
  if (error.errors) {
    for (const prop in error.errors) {
      const err = error.errors[prop]

      if (err.name === 'CastError') {
        message += `${err.message}.\n`
        statusCode = 400
      }

      if (err.name === 'ValidatorError') {
        message += `${err.message}.\n`
        statusCode = 400
      }
    }
  }

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    message += `Unable to find a document with this id: ${error.value}\n`
    statusCode = 404
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    const fieldValue = Object.values(error.keyValue)[0]
    message += `${
      field[0].toUpperCase() + field.substring(1)
    } must be unique.  A document with ${field} = ${fieldValue} exists in the database.\n`
    statusCode = 400
  }

  // ReferenceError error
  if (error.name === 'ReferenceError') {
    message += `${error.message}.<br>`
    statusCode = 400
  }

  // custom error
  if (error.customError) {
    message += `${error.message}.\n`
    statusCode = error.statusCode
  }

  // Sendgrid  error
  if (error.response) {
    // message += `${error.response}.\n`
    message += `We are not able to email registration tokens at thi time, please try again later\n`
    statusCode = 500
  }

  return {
    statusCode: statusCode || 500,
    errors: error.errors,
    status: 'error',
    message: message ? message : error.message ? error.message : 'Server error',
  }
}




const AppError = require('../utils/AppError')

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  })
}

const sendErrorProd = (err, res) => {
  console.log('MMMMMM', err.message)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    console.error('EROOR', err)
    res.status(500).json({
      status: 'error',
      message: 'Something went terribly wrong',
    })
  }
}

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const handleDuplicateDocs = (err) => {
  const message = `Tour name must be unique. <strong>${err.keyValue.name}</strong> has already been used`
  return new AppError(message, 400)
}

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((item) => item.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleInvalidJWTError = (err) => {
  return new AppError('Invalid token, please login again', 401)
}

const handleExpiredJWTError = (err) => {
  return new AppError('Your token has expired, please login again', 401)
}

module.exports = (err, req, res, next) => {
  console.log('ERR', err)
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') sendErrorDev({ ...err }, res)
  if (process.env.NODE_ENV === 'production') {
    if (err.code === '11000') {
      sendErrorProd(handleDuplicateDocs(err), res)
    } else if (err.name) {
      console.log('GGGGGGG', err.name)

      switch (err.name) {
        case 'CastError':
          sendErrorProd(handleCastError(err), res)
          break
        case 'ValidationError':
          sendErrorProd(handleValidationError(err), res)
          break
        case 'JsonWebTokenError':
          sendErrorProd(handleInvalidJWTError(err), res)
          break
        case 'TokenExpiredError':
          sendErrorProd(handleExpiredJWTError(err), res)
          break
        default:
          sendErrorProd(err, res)
          break
      }
    } else {
      sendErrorProd(err, res)
    }
  }
}
