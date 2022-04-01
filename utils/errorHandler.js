const colors = require('colors')
const AppError = require('./AppError')

const sendError = (res, error) => {
  if (process.env.NODE_ENV === 'production') {
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message ? error.message.split(',').join('<br>') || 'Server error' : '',
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went terribly wrong',
      })
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.log('VVVVVVV', error)
    res.status(200).json({
      error,
      errorCode: error.errorCode,
      status: error.status,
      message: error.message ? error.message.split(',').join('<br>') || 'Server error' : '',
      stack: error.stack,
    })
  }
}

module.exports = (err, req, res, next) => {
  // console.log(colors.red.bold('ERRRRRR', err.message))
  // console.log(colors.red.bold('STACK', err.stack))
  // res.status(500).json('error', { error: err })

  let error = {}
  // console.log('AAAAAAA', typeof err, object)

  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400)
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const fieldValue = Object.values(err.keyValue)[0]
    error = new AppError(
      `${
        field[0].toUpperCase() + field.substring(1)
      } must be unique.  A document with ${field} = ${fieldValue} exists in the database`,
      400,
      'not-unique'
    )
  } else if (err.name === 'ValidationError') {
    error = new AppError(
      Object.values(err.errors).map((item) => item.message),
      400
    )
  } else if (err.name === 'JsonWebTokenError') {
    error = new AppError(`Invalid token`, 401)
  } else if (err.name === 'TokenExpiredError') {
    error = new AppError(`Your token has expired. pleaselogin`, 401)
  } else error = err

  sendError(res, error)
}
