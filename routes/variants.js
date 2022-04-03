const express = require('express')
const { fetchAll, createDoc, updateDoc, deleteDoc, deleteDocs } = require('../controllers/factory')
const { setProductAuthor } = require('../controllers/products')
const { protect, authorize } = require('../controllers/auth')

const Model = require('../models/variant')

const router = express.Router()

router.route('/').get(fetchAll(Model))

router.use(protect)
router.use(authorize('admin'))

router.route('/deleteMany').delete(deleteDocs(Model))
router.route('/').post(setProductAuthor, createDoc(Model))
router.route('/:id').delete(deleteDoc(Model))
router.route('/:id').patch(setProductAuthor, updateDoc(Model))

module.exports = router
