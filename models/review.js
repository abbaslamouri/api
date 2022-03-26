const mongoose = require('mongoose')
const Tour = require('../models/tour')
// const slugify = require('slugify')
// const validator = require('validator')
// const User = require('./userModel')

const schema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review is required'],
      trim: true,
      // maxLength: [50, '50 characters max'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must be >=  1'],
      max: [5, 'Ratings must be <= to 5'],
    },
    // createdDate: {
    //   type: Date,
    //   default: Date.now(),
    // },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Tour is required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review author is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

schema.index({ tour: 1, user: 1 }, { unique: true })

// schema.virtual('durationWeeks').get(function () {
//   return this.duration / 7
// })

// Document Middleware, runs before save() and create()
schema.post('save', function () {
  this.constructor.averageRatings(this.tour)
})

// // Embedding
// schema.pre('save', async function (next) {
//   // const guidesPromises = this.guides.map(async (id) => await User.findById(id))
//   // this.guides = await Promise.all(guidesPromises)
//   next()
// })

// // Query Middleware
schema.pre(/^findOneAnd/, async function (next) {
  this.docToUpdate = await this.model.findOne(this.getQuery())
  next()
})

schema.post(/^findOneAnd/, async function () {
  await this.docToUpdate.constructor.averageRatings(this.docToUpdate.tour)
})

schema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // })
  this.populate({
    path: 'user',
    select: 'name',
  })
  next()
})

// // Aggregation Middleware
// schema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
//   next()
// })

schema.statics.averageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        ratingsCount: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])
  if (stats.length) {
    await Tour.findByIdAndUpdate(tourId, { ratingsAverage: stats[0].avgRating, ratingsQuantity: stats[0].ratingsCount })
  } else {
    await Tour.findByIdAndUpdate(tourId, { ratingsAverage: 4.5, ratingsQuantity: 0 })
  }
}

module.exports = mongoose.model('Review', schema)
