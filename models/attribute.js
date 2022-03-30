const mongoose = require('mongoose')

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'Attribute Name is required'],
			minlength: [3, 'Too short'],
			maxlength: [100, 'Attribute Name cannot be more than 100 characters long'],
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
		},
	},

	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Attribute', schema)
