const express = require('express')

// const {
// getAllUsers,
// createUser,
// getUser,
// updateUser,
// deleteUser,
// getMe,
// updateMe,
// deleteMe,
// uploadUserPhoto,
// } = require('../controllers/users')
const {
  signup,
  completeSignup,
  signin,
  forgotPassword,
  resetPassword,
  updateLoggedInPassword,
  protect,
  // updateMyPassword,
  // checkAuth,
  // restrictTo,
  // logout,
} = require('../controllers/auth')

const router = express.Router()

router.route('/signup').post(signup)
router.route('/completeSignup/:token').patch(completeSignup)
router.route('/signin').post(signin)
// router.route('/logout').get(logout)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:token').patch(resetPassword)

router.use(protect)

router.route('/updateLoggedInPassword').patch(updateLoggedInPassword)

// router.route('/get-me').get(getMe, getUser)
// router.route('/update-me').patch(uploadUserPhoto, updateMe)
// router.route('/delete-me').delete(deleteMe)

// router.use(restrictTo('admin'))

// router.route('/').get(getAllUsers).post(createUser)
// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
