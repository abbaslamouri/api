const mongoose = require('mongoose')
const Tour = require('../models/tourModel')
// const slugify = require('slugify')
// const validator = require('validator')
// const User = require('./userModel')

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review is required'],
      trim: true,
      // maxLength: [1000, 'Name must conatin no more than 40 characters max'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'Ratings must be >=  0'],
      max: [5, 'Ratings must be <= to 5'],
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
    tour: { type: mongoose.Schema.ObjectId, ref: 'Tour', required: [true, 'Tour is required'] },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: [true, 'Review author is required'] },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

// reviewSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7
// })

// Document Middleware, runs before save() and create()
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour)
})

// // Embedding
// reviewSchema.pre('save', async function (next) {
//   // const guidesPromises = this.guides.map(async (id) => await User.findById(id))
//   // this.guides = await Promise.all(guidesPromises)
//   next()
// })

// // Query Middleware
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.docToUpdate = await this.model.findOne(this.getQuery())
  next()
})

reviewSchema.post(/^findOneAnd/, async function () {
  await this.docToUpdate.constructor.calcAverageRatings(this.docToUpdate.tour)
})

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // })
  this.populate({
    path: 'user',
    select: 'name photo',
  })
  next()
})

// // Aggregation Middleware
// reviewSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
//   next()
// })

reviewSchema.statics.calcAverageRatings = async function (tourId) {
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
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, { ratingsAverage: stats[0].avgRating, ratingsQuantity: stats[0].ratingsCount })
  } else {
    await Tour.findByIdAndUpdate(tourId, { ratingsAverage: 4.5, ratingsQuantity: 0 })
  }
}

module.exports = mongoose.model('Review', reviewSchema)
