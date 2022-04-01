const mongoose = require('mongoose')
const slugify = require('slugify')

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

    sortOrder: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Document Middleware, runs only before save() and create()
schema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// Virtual populate
schema.virtual('attributeterms', {
  ref: 'Attributeterm',
  foreignField: 'parent',
  localField: '_id',
})

schema.pre(/^find/, function (next) {
  this.populate({
    path: 'attributeterms',
    select: 'name slug',
  })
  next()
})

module.exports = mongoose.model('Attribute', schema)
