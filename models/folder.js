const mongoose = require('mongoose')

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
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Folder', schema)
