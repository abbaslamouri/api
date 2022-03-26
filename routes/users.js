const express = require('express')
const Model = require('../models/user')

const { updateLoggedInData, deleteLoggedIn, fetchLoggedIn } = require('../controllers/users')

const { fetchAll, fetchDoc, createDoc, updateDoc, deleteDoc } = require('../controllers/factory')
const { protect, authorize } = require('../controllers/auth')

const router = express.Router()

router.use(protect)

router.route('/fetchLoggedIn').get(fetchLoggedIn, fetchDoc(Model))
router.route('/updateLoggedInData').patch(updateLoggedInData)
router.route('/deleteLoggedIn').delete(deleteLoggedIn)

router.use(authorize('admin'))

router.route('/').get(fetchAll(Model)).post(createDoc(Model))
router.route('/:id').get(fetchDoc(Model)).patch(updateDoc(Model)).delete(deleteDoc(Model))

module.exports = router
