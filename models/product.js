const mongoose = require('mongoose')
const slugify = require('slugify')

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      maxlength: [50, 'Name cannot be more than 100 characters long'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    permalink: {
      type: String,
      lowercase: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    seoTitle: {
      type: String,
    },
    seoDescription: {
      type: String,
    },
    description: {
      type: String,
      maxlength: [2000, 'Name cannot be more than 2000 characters long'],
    },
    excerpt: {
      type: String,
      maxlength: [2000, 'Name cannot be more than 2000 characters long'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    intensity: {
      type: String,
      maxlength: [2000, 'Name cannot be more than 2000 characters long'],
    },
    roastiness: {
      type: String,
      maxlength: [2000, 'Name cannot be more than 2000 characters long'],
    },
    gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    productType: {
      type: String,
    },
    virtual: {
      type: Boolean,
      default: false,
    },
    downloadable: {
      type: Boolean,
      default: false,
    },
    taxStatus: {
      type: String,
      enum: ['taxable', 'shippingOnly', 'none'],
    },
    taxClass: {
      type: String,
      enum: ['standard', 'reducedRate', 'zero'],
    },
    sku: {
      type: String,
    },
    manageInventory: {
      type: Boolean,
      default: false,
    },
    stockQty: {
      type: Number,
      default: 0,
    },
    allowBackorders: {
      type: String,
      enum: ['allow', 'disallow', 'notify'],
      default: 'notify',
    },
    lowStockThreshold: {
      type: Number,
      default: 2,
    },
    shippingOptions: {
      type: Boolean,
      default: false,
    },
    shipping: {
      weight: String,
      dimensions: {
        length: String,
        width: String,
        height: String,
      },
    },
    sortOrder: {
      type: String,
      default: 0,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    attributes: [
      {
        attribute: { type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' },
        terms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attributeterm' }],
        defaultTerm: { type: mongoose.Schema.Types.ObjectId, ref: 'Attributeterm' },
        enabled: {
          type: Boolean,
          default: false,
        },
        variation: {
          type: Boolean,
          default: false,
        },
      },
    ],
    soldQty: {
      type: Number,
      default: 0,
    },
    orders: {
      type: Number,
      default: 0,
    },
    sales: {
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Product author is required'] },
    tahnkYouPage: {
      type: String,
    },
    extraFields: [
      {
        name: String,
        isRequired: Boolean,
      },
    ],
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

schema.virtual('variants', {
  ref: 'Variant',
  foreignField: 'product',
  localField: '_id',
})

// Document Middleware, runs only before save() and create()
schema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  this.permalink = this.permalink ? this.permalink : slugify(this.name, { lower: true })
  next()
})

schema.pre(/^find/, function (next) {
  this.populate({
    path: 'categories',
    model: 'Category',
    select: 'name slug permalink',
  })
  this.populate({
    path: 'gallery',
    model: 'Media',
    select: 'name slug path url mimetype',
  })
    .populate({
      path: 'variants',
      model: 'Variant',
      select: '-createdAt',
    })
    // .populate({
    //   path: 'attributes',
    //   model: 'Attribute',
    //   select: '-createdAt',
    // })
    .populate({
      path: 'attributes.attribute',
      model: 'Attribute',
      select: '-createdAt',
    })
    .populate({
      path: 'attributes.terms',
      model: 'Attributeterm',
      select: '-createdAt',
    })
    .populate({
      path: 'attributes.defaultTerm',
      model: 'Attributeterm',
      select: '-createdAt',
    })
  next()
})

module.exports = mongoose.model('Product', schema)
