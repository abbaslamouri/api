const jwt = require('jsonwebtoken')
const stripe = require('stripe')(process.env.STRIPE_SK)
// const sgMail = require('@sendgrid/mail')
const crypto = require('crypto')
const { promisify } = require('util')
const Model = require('../models/user.js')
const AppError = require('../utils/AppError')
const asyncHandler = require('../utils/asyncHandler')
const sendEmail = require('../utils/Email')

const sendTokenResponse = async (res, statusCode, user) => {
  let token = null
  if (user) {
    token = await user.getSinedJwtToken()
    auth = { token, user }
  }
  // res.cookie('auth', JSON.stringify(auth), {
  //   expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production' ? true : false,
  //   path: '/',
  // })

  // res.cookie('token', JSON.stringify(token), {
  //   expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production' ? true : false,
  //   path: '/',
  // })
  user.password = undefined
  res.status(statusCode).json({
    status: 'success',
    auth,
  })
}

exports.signup = asyncHandler(async (req, res, next) => {
  console.log('RB', req.body)
  const { user, completeSingupUrl, emailSubject } = req.body
  const customer = await stripe.customers.create({ ...user })
  if (customer) user.stripeCustomerId = customer.id
  console.log('CUSTOMER', customer)
  const doc = await Model.create({
    ...user,
    password: '#0elhEHh*3Uyc$r^JQ@Nit3&f!U3i',
  })
  if (!doc) return next(new AppError(`We can't create user ${user.name}`, 404))
  const resetToken = await doc.createPasswordResetToken()
  await doc.save()
  doc.password = undefined
  await new sendEmail({
    name: user.name,
    email: user.email,
    emailSubject,
    url: `${completeSingupUrl}/?token=${resetToken}`,
  }).sendCompleteSignup()

  res.status(200).json({
    status: 'success',
    message: 'Email sent',
  })
})

exports.completeSignup = asyncHandler(async (req, res, next) => {
  console.log('RPT', req.params.token)
  const hashedToken = await crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await Model.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })
  if (!user) return next(new Error(`Your registration token is invlaid or has expired`), 400)
  if (user.email !== req.body.email.toLowerCase()) return next(new Error(`Invalid email`), 400)
  user.password = req.body.password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  user.active = true
  console.log(user)
  await user.save()
  const url = `${process.env.BASE_URL}`
  // await new Email(user, url).sendWelcome()
  return await sendTokenResponse(res, 200, user)
})

exports.signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) return next(new AppError('Email and Password are required', 401))
  const user = await Model.findOne({ email }).select('+password')
  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError('Invalid email or password', 401))
  sendTokenResponse(res, 200, user)
  // res.status(200).json({
  //   status: 'success',
  //   token: await signToken(user._id),
  // })
})

exports.signout = asyncHandler(async (req, res, next) => {
  auth = { token: ' ', user: {} }
  // res.cookie('auth', JSON.stringify(auth), {
  //   expires: new Date(Date.now() + 1000),
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production' ? true : false,
  //   // path: '/',
  // })
  res.status(200).json({
    status: 'success',
    data: null,
  })
})

exports.protect = asyncHandler(async (req, res, next) => {
  let token = ''
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt
  }
  if (!token) return next(new AppError('You are not allowed to access these resources, please login', 401))
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  const decodedUser = await Model.findById(decoded.id)

  if (!decodedUser) return next(new AppError('We cannot find a user with this token in our database', 401))
  if (await decodedUser.hasPasswordChanged(decoded.iat))
    return next(new AppError('User changed password recently, please login again', 401))
  req.user = decodedUser
  next()
})

exports.authorize = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('You do not have adequate permisson to perform this action', 403))
    next()
  })

exports.isLoggedIn = asyncHandler(async (req, res, next) => {
  // if (!req.cookies || !req.cookies.jwt) return next()
  // const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
  // const user = await Model.findById(decoded.id)
  // if (!user) return next()
  // if (await user.hasPasswordChanged(decoded.iat)) return next()
  // res.locals.user = user
  // next()
})

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email, passwordResetUrl, emailSubject } = req.body
  if (!email) return next(new AppError('Please enter a valid email', 404))
  const user = await Model.findOne({ email })
  if (!user) return next(new AppError('We cannot find user with this email in our database', 404))
  const resetToken = await user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })
  user.password = undefined
  await new sendEmail({
    name: user.name,
    email: user.email,
    emailSubject,
    url: `${passwordResetUrl}/?token=${resetToken}`,
  }).sendResetPassword()

  res.status(200).json({
    status: 'success',
    message: 'Email sent',
  })
})

exports.resetPassword = asyncHandler(async (req, res, next) => {
  console.log('RP', req.params)
  const hashedToken = await crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await Model.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
  if (!user) return next(new AppError('Token is invlaid or has expired', 400))
  user.password = req.body.password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()
  sendTokenResponse(res, 200, user)
})

exports.updateLoggedInPassword = asyncHandler(async (req, res, next) => {
  console.log(req.user)
  const user = await Model.findById(req.user.id).select('+password')
  if (!user) return next(new AppError('You must be logged in to change your password', 401))
  if (!(await user.checkPassword(req.body.currentPassword, user.password)))
    return next(new AppError('Invalid current password', 401))
  user.password = req.body.password
  await user.save()
  sendTokenResponse(res, 200, user)
})
