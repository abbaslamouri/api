const APIFeatures = require('../utils/APIFeatures')
const AppError = require('../utils/AppError')
const asyncHandler = require('../utils/asyncHandler')

exports.checkId = (req, res, next, val) => {
  console.log(`Document id is ${val}`)
  // return (req.params.id = val * 1)
  return next()
}

exports.fetchAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const totalCount = await Model.countDocuments()
    const features = new APIFeatures(Model.find(), req.query).filter().sort().fields().search().paginate()
    const docs = await features.query
    // const docs = await features.query.explain()
    res.status(200).json({
      status: 'succes',
      totalCount,
      docs,
    })
  })

exports.fetchDoc = (Model, populateOptions = {}) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findById(req.params.id)
    if (!doc) return next(new AppError(`We can't find a document with id = ${req.params.id}`, 404))
    res.status(200).json({
      status: 'succes',
      doc,
    })
    // let query = Model.findById(req.params.id)
    // if (populateOptions) query.populate(populateOptions)
    // const doc = await query
    // if (!doc) return next(new AppError(`We can't find a document with ID = ${req.params.id}`, 404))
    // res.status(200).json({
    //   status: 'succes',
    //   data: doc,
    // })
  })

exports.deleteDoc = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) return next(new AppError(`We can't find a document with id = ${req.params.id}`, 404))
    res.status(204).json({
      status: 'success',
      doc,
    })
  })

exports.updateDoc = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return new document
      runValidators: true,
    })
    if (!doc) return next(new AppError(`We can't find a document with id = ${req.params.id}`, 404))
    res.status(200).json({
      status: 'success',
      doc,
    })
  })

exports.createDoc = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body)
    if (!doc) return next(new AppError(`We can't create document ${req.body.name}`, 404))
    res.status(201).json({
      status: 'success',
      doc,
    })
  })
