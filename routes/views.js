const express = require('express')
const Model = require('../models/review')
// const { getOverview, getTour, login } = require('../controllers/views')
// const { isLoggedIn } = require('../controllers/auth')

const router = express.Router()

// router.use(isLoggedIn)

router.get('/', fetchAll(Model))
// router.get('/', getOverview)
// router.get('/tour/:slug', getTour)
// router.get('/login', login)

module.exports = router
