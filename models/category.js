const mongoose = require('mongoose')
const slugify = require('slugify')

// const Media = require('~/server/models/media')

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Category Name is required'],
      minlength: [3, 'Name too short'],
      maxlength: [100, 'Name too long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      // minlength: [3, 'Slug too short'],
      // maxlength: [100, 'Slug too long'],
    },
    permalink: {
      type: String,
      unique: true,
      lowercase: true,
      // minlength: [3, 'Permalink too short'],
      // maxlength: [100, 'Permalink too long'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot be more than 2000 characters long'],
    },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Document Middleware, runs only before save() and create()
schema.pre('save', function (next) {
  // this.slug = slugify(this.name, { lower: true })
  // console.log('THIS', this)
  // this.permalink = this.permalink ? this.permalink : slugify(this.name, { lower: true })
  next()
})

schema.pre(/^find/, function (next) {
  this.populate({
    path: 'gallery',
    select: 'name slug path url mimetype',
  }).populate({
    path: 'parent',
    select: 'name slug',
  })
  next()
})

module.exports = mongoose.model('Category', schema)
