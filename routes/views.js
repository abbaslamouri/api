const express = require('express')
const { getOverview, getTour, login } = require('../controllers/views')
const { isLoggedIn } = require('../controllers/auth')

const router = express.Router()

router.use(isLoggedIn)

router.get('/', getOverview)
router.get('/tour/:slug', getTour)
router.get('/login', login)

module.exports = router
