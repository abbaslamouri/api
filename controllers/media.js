const path = require('path')
const fs = require('fs')
const slugify = require('slugify')
const { promisify } = require('util')
const Model = require('../models/media.js')
const AppError = require('../utils/AppError')
const asyncHandler = require('../utils/asyncHandler')

exports.saveFile = asyncHandler(async (req, res, next) => {
  console.log('RF', req.files)
  console.log('RB', req.body)
  const file = req.files.file
  const uploadPath = `${path.join(__dirname, '../public')}/uploads/${file.name}`
  await promisify(file.mv)(uploadPath)
  const doc = await Model.create({
    name: file.name,
    slug: slugify(file.name, { lower: true }),
    path: `/uploads/${file.name}`,
    url: `${process.env.BASE_URL}/uploads/${file.name}`,
    mimetype: file.mimetype,
    size: file.size,
    folder: req.body.folder,
  })

  if (!doc) return next(new AppError(`We can't create  document ${req.body.name}`, 404))
  res.status(200).json({
    status: 'success',
    data: doc,
  })
})

exports.deleteFile = asyncHandler(async (req, res, next) => {
  console.log('here')
  const doc = await Model.findByIdAndDelete(req.params.id)
  if (!doc) return next(new AppError(`We can't find a document with id = ${req.params.id}`, 404))
  var filePath = path.resolve(path.dirname(doc.name))
  if (`${filePath}/public/uploads/${doc.name}`) await fs.promises.unlink(`${filePath}/public/uploads/${doc.name}`)
  res.status(204).json({
    status: 'success',
    doc,
  })
})
