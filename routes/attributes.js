const express = require('express')
const { fetchAll, createDoc, updateDoc, deleteDoc } = require('../controllers/factory')
const Model = require('../models/attribute')

const router = express.Router()

router.route('/').get(fetchAll(Model))
router.route('/').post(createDoc(Model))
router.route('/:id').delete(deleteDoc(Model))
router.route('/:id').patch(updateDoc(Model))

module.exports = router
