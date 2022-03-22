const mongoose = require('mongoose')
const slugify = require('slugify')
// const validator = require('validator')
// const User = require('./userModel')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'tour name is required'],
      unique: true,
      trim: true,
      minLength: [10, 'Name nust contain 10 characters min'],
      maxLength: [40, 'Name must conatin no more than 40 characters max'],
      // validate: {
      //   validator: validator.isAlphanumeric,
      //   message: 'Alpha numeric only',
      // },
    },
    // slug: {
    //   type: String,
    //   unique: true,
    // },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Maximum group size is required'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour difficulty is a required field'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: ' Difficulty must be either easy, medium or difficult',
      },
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0, 'Ratings must be >=  0'],
      max: [5, 'Ratings must be <= to 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour price is required'],
    },
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          // only works with create new document
          return val <= this.price
        },
        message: `Discount ({VALUE}) cannot be greater than price`,
      },
    },
    excerpt: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // gallery: {
    //   type: String,
    //   required: [true, 'Cover image is required'],
    // },
    gallery: [String],
    // createdDate: {
    //   type: Date,
    //   default: Date.now(),
    //   select: false,
    // },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    // startLocation: {
    //   // geoJSON
    //   type: {
    //     type: String,
    //     default: 'Point',
    //     enum: ['Point'],
    //   },
    //   coordinates: [Number],
    //   address: String,
    //   Description: String,
    // },
    // locations: [
    //   {
    //     type: {
    //       type: String,
    //       default: 'Point',
    //       enum: ['Point'],
    //     },
    //     coordinates: [Number],
    //     address: String,
    //     description: String,
    //     day: Number,
    //   },
    // ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// tourSchema.index({ price: 1, ratingsAverage: -1 })
// tourSchema.index({ slug: 1 })
// tourSchema.index({ startLocation: '2dsphere' })

// tourSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7
// })

// tourSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'tour',
//   localField: '_id',
// })

// // Document Middleware, runs before save() and create()
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true })
//   next()
// })

// // Embedding
// tourSchema.pre('save', async function (next) {
//   // const guidesPromises = this.guides.map(async (id) => await User.findById(id))
//   // this.guides = await Promise.all(guidesPromises)
//   next()
// })

// // Query Middleware
// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } })
//   next()
// })

// tourSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'guides',
//     select: '-__v -passwordChangeDate',
//   })
//   next()
// })

// Aggregation Middleware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
//   next()
// })

module.exports = mongoose.model('Tour', tourSchema)
