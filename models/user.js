const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			maxlength: [100, 'Name cannot be more than 50 characters long'],
		},
		email: {
			type: String,
			trim: true,
			unique: true,
			lowercase: true,
			required: [true, 'Email is required'],
			match: [
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Please enter a valid email address',
			],
		},
		title: {
			type: String,
			trim: true,
			maxlength: [20, 'Name cannot be more than 20 characters long'],
		},
		shippingAddresses: [
			{
				company: '',
				name: {
					type: String,
					// default: '',
				},
				addressLine1: {
					type: String,
					// default: '',
				},
				addressLine2: {
					type: String,
					// default: '',
				},
				city: {
					type: String,
					// default: ''
				},
				state: {
					type: mongoose.Schema.ObjectId,
					ref: 'State',
					// default: '',
				},
				postalCode: {
					type: String,
					// default: '',
				},
				country: {
					type: mongoose.Schema.ObjectId,
					ref: 'Country',
					// default: '',
				},
				addressType: {
					type: String,
					enum: ['Residential', 'Commercial'],
					default: 'Residential',
				},
				isDefault: { type: Boolean, default: false },
				phones: [
					{
						phoneType: String,
						phoneNumber: String,
						phoneCountryCode: {
							type: mongoose.Schema.ObjectId,
							ref: 'Country',
							// default: '',
						},
					},
				],
			},
		],

		billingAddress: {
			address1: {
				type: String,
				// default: ''
			},
			address2: {
				type: String,
				// default: ''
			},
			city: {
				type: String,
				// default: ''
			},
			state: {
				type: mongoose.Schema.ObjectId,
				ref: 'State',
				// default: '',
			},
			postalCode: {
				type: String,
				// default: ''
			},
			country: {
				type: mongoose.Schema.ObjectId,
				ref: 'Country',
				// default: '',
			},
		},

		avatar: {
			type: mongoose.Schema.ObjectId,
			ref: 'Media',
		},
		role: {
			type: String,
			enum: ['admin', 'shop-manager', 'customer', 'user', 'guide', 'lead-guide'],
			default: 'user',
		},
		password: {
			type: String,
			required: [true, 'Pasword is required'],
			minlength: [8, 'Password must contain at least 8 charcaters'],
			select: false,
		},
		active: {
			type: Boolean,
			default: false,
			select: false,
		},
		deliveryInstructions: {
			type: String,
			maxlength: [2000, '2000 characters maximum'],
		},

		passwordResetToken: String,
		passwordResetExpires: Date,
		passwordChangeDate: Date,
	},
	{
		timestamps: true,
	}
)

// Document Middleware, runs before save() and create()
schema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	const salt = await bcrypt.genSalt(12)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

schema.pre('save', async function (next) {
	if (!this.isModified('password') || this.isNew) return next()
	this.passwordChangeDate = Date.now() - 1000
	next()
})

schema.methods.getSinedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

schema.methods.checkPassword = async function (password, hash) {
	return await bcrypt.compare(password, hash)
}

schema.methods.hasPasswordChanged = async function (JWTTimestamp) {
	if (this.passwordChangeDate) {
		return parseInt(this.passwordChangeDate.getTime(), 10) / 1000 > JWTTimestamp
	}
	return false
}

schema.methods.createPasswordResetToken = async function () {
	const resetToken = crypto.randomBytes(32).toString('hex')
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	this.passwordResetExpires = Date.now() + process.env.PW_RESET_TOKEN_EXPIRESIN * 60 * 1000
	return resetToken
}

module.exports = mongoose.model('User', schema)
