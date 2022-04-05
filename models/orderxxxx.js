const mongoose = require('mongoose')
const review = require('~/server/models/review')

const schema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Customer ID is required'] },
		items: [
			{
				name: { type: String, required: [true, 'Product name is required'] },
				quantity: { type: Number, required: [true, 'Quantity is required'] },
				image: { type: String, required: [true, 'Product image is required'] },
				price: { type: Number, required: [true, 'Product price is required'] },
				product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: [true, 'Product is required'] },
			},
		],
		paymentMethod: {
			type: String,
			required: [true, 'Payment method is required'],
		},
		paymentResults: {
			id: { type: String },
			status: { type: String },
			update_time: { type: String },
			email: { type: String },
		},
		subTotal: {
			type: Number,
			required: [true, 'Total required'],
			default: 0.0,
		},
		shipping: {
			type: Number,
			required: [true, 'Taxes required'],
			default: 0.0,
		},
		taxes: {
			type: Number,
			required: [true, 'Taxes required'],
			default: 0.0,
		},
		total: {
			type: Number,
			required: [true, 'Total required'],
			default: 0.0,
		},
		paid: {
			type: Boolean,
			default: false,
		},
		delivered: {
			type: Boolean,
			default: false,
		},
		datePaid: {
			type: Date,
		},
		dateDelivered: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Order', schema)
