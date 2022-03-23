const express = require('express')
const {
  //   checkId,
  top5Tours,
  //   getAllTours,
  //   createTour,
  //   getTour,
  //   updateTour,
  //   deleteTour,
  getTourStats,
  getMonthlyPlan,
  //   getToursWithin,
  //   getDistances,
} = require('../controllers/tours')
const { fetchAll, fetchDoc, createDoc, updateDoc, deleteDoc, checkId } = require('../controllers/factory')
const Model = require('../models/tour')

// const { checkAuth, restrictTo } = require('../controllers/auth')

// const reviewRouter = require('../routes/reviews')

const router = express.Router()

router.param('id', checkId)

// router.route('/:tourId/reviews').post(checkAuth, restrictTo('user'), createReview)
// router.use('/:tourId/reviews', reviewRouter)

router.route('/top5Tours').get(top5Tours, fetchAll(Model))
router.route('/stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)
// router.route('/monthly-plan/:year').get(checkAuth, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan)

// router.route('/tours-within/:distance/center/:latlgt/unit/:unit').get(getToursWithin)
// router.route('/distances/:latlgt/unit/:unit').get(getDistances)

router.route('/').get(fetchAll(Model)).post(createDoc(Model))
router.route('/:id').get(fetchDoc(Model)).patch(updateDoc(Model)).delete(deleteDoc(Model))
// router
//   .route('/:id')
//   .get(getTour)
//   .patch(checkAuth, restrictTo('admin', 'lead-guide'), updateTour)
//   .delete(checkAuth, restrictTo('admin', 'lead-guide'), deleteTour)

module.exports = router
