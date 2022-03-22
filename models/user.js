const mongoose = require('mongoose')
const validator = require('validator')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxLength: [100, 'Name must conatin no more than 40 characters max'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxLength: [100, 'Name must conatin no more than 40 characters max'],
      validate: {
        validator: validator.isEmail,
        message: 'Please enter a valid email',
      },
    },
    photo: {
      type: String,
      default: "default.jpg"
    },
    password: {
      type: String,
      required: [true, 'Pasword is required'],
      minLength: [4, 'Name nust contain 8 characters min'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Confirmation Pasword is required'],
      validate: {
        // Only works on save()/create()
        validator: function (val) {
          return val === this.password
        },
        message: 'Passwords dont match',
      },
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },
    passwordChangeDate: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  }
)

// userSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7
// })

// Document Middleware, runs before save() and create()
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  // const salt = await bcrypt.genSaltSync(12)
  // this.password = await bcrypt.hashSync(this.password, salt)
  this.passwordConfirm = undefined
  next()
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next()
  this.passwordChangeDate = Date.now() - 1000
  next()
})

// Query Middleware
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } })
  next()
})

userSchema.methods.checkPassword = async function (password, hash) {
  return await bcrypt.compare(password, hash)
}

userSchema.methods.hasPasswordChanged = async function (JWTTimestamp) {
  if (this.passwordChangeDate) {
    return parseInt(this.passwordChangeDate.getTime(), 10) / 1000 > JWTTimestamp
  }

  return false
}

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

// // Query Middleware
// userSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } })
//   next()
// })

// // Aggregation Middleware
// userSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
//   next()
// })

module.exports = mongoose.model('User', userSchema)
