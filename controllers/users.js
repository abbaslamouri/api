const multer = require('multer')
const User = require('../models/userModel.js')
const APIFeatures = require('../utils/APIFeatures')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const factory = require('../controllers/handlerFactory')

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/users')
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1]
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
  },
})

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Only images are allowed', 400), false)
  }
}
const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

// const upload = multer({ dest: 'public/img/users/' })

exports.uploadUserPhoto = upload.single('photo')

const filteredObj = (obj, allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) newObj[prop] = obj[prop]
  })

  return newObj
}

const createSendData = async (user, statusCode, res) => {
  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
  })
}

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id
  next()
})

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log('FILE', req.file)
  console.log('BODY', req.body)

  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('You cannot use this route for passsword updates', 400))

  const filteredBody = filteredObj(req.body, ['name', 'email'])
  if (req.file) filteredBody.photo = req.file.filename
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })
  if (!user) return next(new AppError('You must be logged in to change your data', 401))

  createSendData(user, 200, res)
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  createSendData(null, 204, res)
})

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined.  Please use /signup instead',
  })
})

exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
