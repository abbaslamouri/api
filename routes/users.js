const express = require('express')

const {
  updateLoggedInData,
  // getAllUsers,
  // createUser,
  // getUser,
  // updateUser,
  // deleteUser,
  // getMe,
  // updateMe,
  // deleteMe,
  // uploadUserPhoto,
} = require('../controllers/users')
const {
  signup,
  // login,
  // forgotPassword,
  // resetPassword,
  // updateMyPassword,
  protect,
  // restrictTo,
  // logout,
} = require('../controllers/auth')

const router = express.Router()

router.route('/signup').post(signup)
// router.route('/login').post(login)
// router.route('/logout').get(logout)
// router.route('/forgot-password').post(forgotPassword)
// router.route('/reset-password/:token').patch(resetPassword)

router.use(protect)

// router.route('/update-my-password').patch(updateMyPassword)

// router.route('/getCurrentUser').get(getCurrentUser, getUser)
// router.route('/update').patch(uploadUserPhoto, updateMe)
router.route('/updateLoggedInData').patch(updateLoggedInData)
// router.route('/delete-me').delete(deleteMe)

// router.use(restrictTo('admin'))

// router.route('/').get(getAllUsers).post(createUser)
// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
