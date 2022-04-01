const mongoose = require('mongoose')
const slugify = require('slugify')

// const Attribute = require('~/server/models/attribute')

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, ' Name is required'],
      // minlength: [3, 'Too short'],
      maxlength: [100, 'Name cannot be more than 100 characters long'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attribute',
      required: [true, 'Attribute term parent is required'],
    },
  },

  {
    timestamps: true,
  }
)

// Document Middleware, runs only before save() and create()
schema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

module.exports = mongoose.model('Attributeterm', schema)
