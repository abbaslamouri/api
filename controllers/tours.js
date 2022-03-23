// const fs = require('fs')
const Model = require('../models/tour.js')
const asyncHandler = require('../utils/asyncHandler')
// const factory = require('../controllers/factory')
// const AppError = require('../utils/AppError')

exports.checkId = (req, res, next, val) => {
  return console.log(`Tour is id ${val}`)
  next()
}

exports.top5Tours = async (req, res, next) => {
  req.query.sort = '-ratingsAverage, price'
  req.query.fields = 'name,price, ratingsAverage, summary, difficulty'
  req.query.limit = 5
  next()
}

exports.getTourStats = asyncHandler(async (req, res, next) => {
  const stats = await Model.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null,
        _id: { $toUpper: '$difficulty' },
        tourCount: { $sum: 1 },
        ratingsCount: { $sum: '$ratingsAverage' },
        averageRating: { $avg: '$ratingsAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { averagePrice: 1 },
    },
  ])
  res.status(200).json({
    status: 'success',
    data: stats,
  })
})

exports.getMonthlyPlan = asyncHandler(async (req, res, next) => {
  const year = req.params.year * 1
  const plan = await Model.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        tourCount: { $sum: 1 },
        tours: { $push: '$name' },
        ratingsCount: { $sum: '$ratingsAverage' },
        averageRating: { $avg: '$ratingsAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { month: 1 },
    },
    {
      $limit: 6,
    },
  ])
  res.status(200).json({
    status: 'success',
    count: plan.length,
    data: plan,
  })
})

exports.getToursWithin = asyncHandler(async (req, res, next) => {
  // const { distance, latlgt, unit } = req.params
  // const [lat, lgt] = latlgt.split(',')
  // const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1
  // if (!lat || !lgt)
  //   return next(new AppError('Latitude and longitude are required.  Please provide comma separated values', 400))
  // const tours = await Tour.find({
  //   startLocation: { $geoWithin: { $centerSphere: [[lgt, lat], radius] } },
  // }).select('name startLocation')
  // console.log(distance, lgt, lat, unit)
  // res.status(200).json({
  //   status: 'success',
  //   results: tours.length,
  //   data: {
  //     data: tours,
  //   },
  // })
})

exports.getDistances = asyncHandler(async (req, res, next) => {
  // const { latlgt, unit } = req.params
  // const [lat, lgt] = latlgt.split(',')
  // if (!lat || !lgt)
  //   return next(new AppError('Latitude and longitude are required.  Please provide comma separated values', 400))
  // const distances = await Tour.aggregate([
  //   {
  //     $geoNear: {
  //       near: {
  //         type: 'Point',
  //         coordinates: [lgt * 1, lat * 1],
  //       },
  //       distanceField: 'distance',
  //       distanceMultiplier: unit === 'mi' ? 0.0006213 : 0.001,
  //     },
  //   },
  //   {
  //     $project: {
  //       name: 1,
  //       distance: 1,
  //     },
  //   },
  // ])
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     data: distances,
  //   },
  // })
})
