const express = require('express')
const {
  // cheapest5Alias,
  fetchTourReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  setTourAndUserIds,
  // getTourStats,
  // getMonthlyPlan,
} = require('../controllers/reviews')
const { fetchAll, createDoc, updateDoc, deleteDoc } = require('../controllers/factory')
const Model = require('../models/review')
const { protect, authorize } = require('../controllers/auth')

const router = express.Router({ mergeParams: true })

router.use(protect)

// router.route('/cheapest5').get(cheapest5Alias, gettAllTours)
// router.route('/tour-stats').get(getTourStats)
// router.route('/monthly-plan/:year').get(getMonthlyPlan)
router.route('/').get(authorize('user', 'admin'), fetchTourReviews)
router.route('/').post(authorize('user'), setTourAndUserIds, createDoc(Model))

// .post(protect, authorize('user', 'admin'), createDoc(Model))

// router.route('/').post(protect, authorize('user', 'admin'), createDoc(Model))
// router.route('/').get(getAllReviews).post(restrictTo('user', 'admin'), setTourNUserIds, createReview)
router
  .route('/:id')
  .patch(authorize('user', 'admin'), updateDoc(Model))
  .delete(authorize('user', 'admin'), deleteDoc(Model))

module.exports = router
