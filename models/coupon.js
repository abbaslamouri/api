const mongoose = require('mongoose')

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'Coupon Name is required'],
			minlength: [3, 'Too short'],
			maxlength: [20, 'Too long'],
			unique: true,
			uppercase: true,
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
			index: true,
		},
		description: {
			type: String,
			index: true,
			maxlength: [2000, 'Too long'],
		},
		expiry: {
			type: Date,
		},
		amount: {
			type: Number,
			required: [true, 'Coupon Name is required'],
		},
		type: {
			type: String,
			enum: ['dollar', 'percent'],
			default: 'percent',
		},
		freeShipping: {
			type: Boolean,
			default: false,
		},
		products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
	},
	{
		timestamps: true,
	}
)

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

module.exports = mongoose.model('Coupon', schema)
