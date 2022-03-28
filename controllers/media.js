const path = require('path')
const jwt = require('jsonwebtoken')
const slugify = require('slugify')
const crypto = require('crypto')
const { promisify } = require('util')
const Model = require('../models/media.js')
const AppError = require('../utils/AppError')
const asyncHandler = require('../utils/asyncHandler')
const Email = require('../utils/Email')

exports.saveFile = asyncHandler(async (req, res, next) => {
  const file = req.files.file
  const uploadPath = `${path.join(__dirname, '../public')}/uploads/${file.name}`
  await promisify(file.mv)(uploadPath)
  const doc = await Model.create({
    name: file.name,
    slug: slugify(file.name, { lower: true }),
    path: `/uploads/${file.name}`,
    url: `${process.env.BASE_URL}/upload/${file.name}`,
    mimetype: file.mimetype,
    size: file.size,
  })

  if (!doc) return next(new AppError(`We can't create  document ${req.body.name}`, 404))
  res.status(200).json({
    status: 'success',
    data: doc,
  })
})
