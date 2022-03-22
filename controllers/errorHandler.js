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
