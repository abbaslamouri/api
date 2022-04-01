const mongoose = require('mongoose')
const slugify = require('slugify')


const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Folder Name is required'],
      maxlength: [100, 'Name cannot be more than 100 characters long'],
    },
    slug: {
      type: String,
      unique: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Folder', schema)
