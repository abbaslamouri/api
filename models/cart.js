import mongoose from 'mongoose'
// import Product from '~/server/models/product'
// import User from '~/server/models/user'
// import Coupon from '~/server/models/coupon'

const schema = new mongoose.Schema(
  {
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'A product is required to save cart in the database'],
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Variant',
        },
        quantity: Number,
        price: Number,
        salePrice: Number,
        productType: String,
      },
    ],
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // customer: Object,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
    // required: [true, 'A Customer is required to save cart in the database'],
    paymentMethod: String,
    cartTotal: Number,
    discount: Number,
    coupons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }],
  },
  {
    timestamps: true,
  }
)

// schema.index({ name: 'text', slug: 'text' })

// Document Middleware, runs before save() and create()
// schema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true })
//   // this.path = `/${this.slug}`
//   next()
// })

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

export default mongoose.model('Cart', schema)
