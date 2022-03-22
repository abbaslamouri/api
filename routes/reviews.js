const express = require('express')
const {
  // cheapest5Alias,
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  setTourNUserIds,
  // getTourStats,
  // getMonthlyPlan,
} = require('../controllers/reviews')
const { checkAuth, restrictTo } = require('../controllers/auth')

const router = express.Router({ mergeParams: true })

router.use(checkAuth)

// router.route('/cheapest5').get(cheapest5Alias, gettAllTours)
// router.route('/tour-stats').get(getTourStats)
// router.route('/monthly-plan/:year').get(getMonthlyPlan)

router.route('/').get(getAllReviews).post(restrictTo('user', 'admin'), setTourNUserIds, createReview)
router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview)

module.exports = router
