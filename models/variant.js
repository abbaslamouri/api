const mongoose = require('mongoose')
// const Product = require('~/server/models/product')
// const Attributeterm = require('~/server/models/attributeterm')

const schema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    attrTerms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attributeterm' }],
    enabled: {
      type: Boolean,
      default: true,
    },
    virtual: {
      type: Boolean,
      default: false,
    },
    downloadable: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      maxlength: [2000, 'Name cannot be more than 2000 characters long'],
    },
    excerpt: {
      type: String,
      maxlength: [2000, 'Name cannot be more than 2000 characters long'],
    },
    // featuredImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
    // gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    // type: {
    //   type: String,
    // },
    gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    price: {
      type: Number,
    },
    salePrice: {
      type: Number,
    },
    taxStatus: {
      type: String,
      enum: ['taxable', 'shippingOnly', 'none'],
    },
    sku: {
      type: String,
    },
    stockQty: {
      type: Number,
      default: 0,
    },
    allowBackorder: {
      type: String,
      enum: ['yes', 'no', 'notify'],
    },
    lowStockThreshold: {
      type: Number,
    },
    shipping: {
      weight: String,
      dimensions: {
        length: String,
        width: String,
        height: String,
      },
    },
    shippingClass: {
      type: String,
    },

    taxClass: {
      type: String,
      enum: ['same-as-parent', 'standard', 'reduced', 'zero'],
    },
    // categories: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category',
    //     // required: [true, 'Product Category is required'],
    //   },
    // ],
    // attributes: [
    //   {
    //     attribute: { type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' },
    //     // required: [true, 'Product Category is required'],
    //     terms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attributeterm' }],
    //     // required: [true, 'Product Category is required'],
    //   },
    // ],
    soldQty: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        rating: Number,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Review author is required'] },
      },
    ],
    ReviewsCount: {
      type: Number,
      default: 0,
    },
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Product author is required'] },
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  }
)

// schema.index({ name: 'text', slug: 'text' })

schema.pre(/^find/, function (next) {
  this.populate({
    path: 'gallery',
    select: 'name slug path url mimetype',
  })
  next()
})

// schema.virtual('averageRating').get(function () {
//   if (!this.ratings) return
//   const ratingsArr = this.ratings.map((el) => el.rating)
//   // console.log('ZZZZZZZZZ', ratingsArr)
//   return ratingsArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / this.ratings.length
// })

// Document Middleware, runs before save() and create()
// schema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true })
//   this.path = `/${this.slug}`
//   next()
// })

module.exports = mongoose.model('Variant', schema)
