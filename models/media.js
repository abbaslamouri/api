const mongoose = require('mongoose')
// const Folder = require('../models/folder')

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'File Name is required'],
      maxlength: [500, 'Name cannot be more than 100 characters long'],
      default: 'placeholder.png',
      // text: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    // originalname: {
    //   type: String,
    //   required: [true, 'File Name is required'],
    //   maxlength: [500, 'Name cannot be more than 100 characters long'],
    //   default: 'user-placeholder-image.jpg',
    // },
    // filename: {
    //   type: String,
    //   unique: true,
    // },

    path: {
      type: String,
      default: '/placeholder.png',
    },
    url: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    size: {
      type: Number,
      max: [20000000, 'File size ({{VALUE}}) is greater that the maximum allowed of 200000000'],
      required: [true, 'File Size is required'],
    },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: [true, 'Folder is required'] },
    // originalName: {
    //   type: String,
    // },
    // dateCreated: {
    //   type: Date,
    //   default: Date.now(),
    // },
    // folder: {
    //   type: String,
    //   default: 'drive',
    // },
    // folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  },
  {
    timestamps: true,
  }
)

// schema.index({ name: 'text', path: 'text' })

// // Document Middleware, runs before save() and create()
// schema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next()
//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
//   this.confirmPassword = undefined
//   next()
// })

// schema.methods.getSinedJwtToken = async function () {
//   return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
// }

// schema.methods.checkPassword = async function (password) {
//   return await bcrypt.compare(password, this.password)
// }

// schema.methods.createPasswordResetToken = async function () {
//   const resetToken = crypto.randomBytes(32).toString('hex')
//   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
//   this.passwordResetExpire = Date.now() + 10 * 60 * 1000
//   return resetToken
// }

// schema.pre('save', async function (next) {
//   if (!this.isModified('password') || this.isNew) return next()
//   this.passwordChangeDate = Date.now() - 1000
//   next()
// })

// schema.methods.hasPasswordChanged = async function (JWTTimestamp) {
//   if (this.passwordChangeDate) {
//     return parseInt(this.passwordChangeDate.getTime(), 10) / 1000 > JWTTimestamp
//   }

//   return false
// }

module.exports = mongoose.model('Media', schema)
