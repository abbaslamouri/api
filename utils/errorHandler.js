const colors = require('colors')
const AppError = require('./AppError')

module.exports = (err, req, res, next) => {
  // console.log('ERRRRRR', err.message)
  // console.log(colors.brightRed(err))
  // console.log(colors.brightYellow(err))

  let error = { ...err }
  error.message = err.message

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new AppError(`Unable to find a document with this this id: ${error.value}`, 404)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = new AppError(
      Object.values(err.errors).map((item) => item.message),
      400
    )
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const fieldValue = Object.values(err.keyValue)[0]
    error = new AppError(
      `${
        field[0].toUpperCase() + field.substring(1)
      } must be unique.  A document with ${field} = ${fieldValue} exists in the database`,
      400
    )
  }

  console.log('ERR', error.message)
  // console.log('ERR', error.message.split(',').join('<br>'))?

  res.status(error.statusCode || 500).json({
    // statusCode: error.statusCode || 500,
    name: error.name,
    errors: error.errors,
    errorCode: error.code,
    errorValue: error.value,
    status: 'error',
    message: error.message.split(',').join('<br>') || 'Server error',
  })
}
