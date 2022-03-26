// const fs = require('fs')
// const Review = require('../models/review.js')
// const factory = require('../controllers/factory')
const asyncHandler = require('../utils/asyncHandler')

const Model = require('../models/review')

exports.setTourAndUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user.id
  next()
}

exports.fetchTourReviews = asyncHandler(async (req, res, next) => {
  let docs = []
  if (req.params.tourId) docs = await Model.find({ tour: req.params.tourId })
  else docs = await Model.find()
  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: docs,
  })
})

// exports.fetchAllReviews = factory.getAll(Review)
// exports.getReview = factory.getOne(Review)
// exports.createReview = factory.createOne(Review)
// exports.updateReview = factory.updateOne(Review)
// exports.deleteReview = factory.deleteOne(Review)
