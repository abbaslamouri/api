const express = require('express')
const {
  //   checkId,
  top5Tours,
  //   getAllTours,
  //   createTour,
  // fetchTour,
  //   updateTour,
  //   deleteTour,
  getTourStats,
  getMonthlyPlan,
  fetchToursWithin,
  fetchDistances,
  //   getToursWithin,
  //   getDistances,
} = require('../controllers/tours')
const { fetchAll, fetchDoc, createDoc, updateDoc, deleteDoc, checkId } = require('../controllers/factory')
const { createReview } = require('../controllers/reviews')
const Model = require('../models/tour')

const router = express.Router()

const reviewRouter = require('../routes/reviews')
router.use('/:tourId/reviews', reviewRouter)

const { protect, authorize } = require('../controllers/auth')

router.param('id', checkId)

// router.route('/:tourId/reviews').post(protect, authorize('user'), createReview)

router.route('/top5Tours').get(top5Tours, fetchAll(Model))
router.route('/stats').get(protect, authorize('admin'), getTourStats)
router.route('/monthly-plan/:year').get(protect, authorize('admin'), getMonthlyPlan)
// router.route('/monthly-plan/:year').get(checkAuth, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan)

router.route('/within/:distance/center/:latlgt/unit/:unit').get(fetchToursWithin)
router.route('/distances/:latlgt/unit/:unit').get(fetchDistances)

router.route('/').get(fetchAll(Model)).post(protect, authorize('admin'), createDoc(Model))
router
  .route('/:id')
  .get(fetchDoc(Model))
  .patch(protect, authorize('admin'), updateDoc(Model))
  .delete(protect, authorize('admin'), deleteDoc(Model))
// router
//   .route('/:id')
//   .get(getTour)
//   .patch(checkAuth, restrictTo('admin', 'lead-guide'), updateTour)
//   .delete(checkAuth, restrictTo('admin', 'lead-guide'), deleteTour)

module.exports = router
