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
	// login,
	// forgotPassword,
	// resetPassword,
	// updateMyPassword,
	// checkAuth,
	// restrictTo,
	// logout,
} = require('../controllers/auth')

const router = express.Router()

router.route('/signup').post(signup)
// router.route('/login').post(login)
// router.route('/logout').get(logout)
// router.route('/forgot-password').post(forgotPassword)
// router.route('/reset-password/:token').patch(resetPassword)

// router.use(checkAuth)

// router.route('/update-my-password').patch(updateMyPassword)

// router.route('/get-me').get(getMe, getUser)
// router.route('/update-me').patch(uploadUserPhoto, updateMe)
// router.route('/delete-me').delete(deleteMe)

// router.use(restrictTo('admin'))

// router.route('/').get(getAllUsers).post(createUser)
// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
