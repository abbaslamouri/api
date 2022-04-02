const express = require('express')
const { fetchAll, createDoc, updateDoc, deleteDoc } = require('../controllers/factory')
const { setProductAuthor } = require('../controllers/products')
const { protect, authorize } = require('../controllers/auth')

const Model = require('../models/variant')

const router = express.Router()

router.route('/').get(fetchAll(Model))

router.use(protect)
router.use(authorize('admin'))

router.route('/').post(setProductAuthor, createDoc(Model))
router.route('/:id').delete(deleteDoc(Model))
router.route('/:id').patch(setProductAuthor, updateDoc(Model))

module.exports = router
