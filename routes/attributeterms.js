const express = require('express')
const { fetchAll, createDoc, updateDoc, deleteDoc, deleteDocs } = require('../controllers/factory')
const Model = require('../models/attributeterm')

const router = express.Router()

router.route('/deleteMany').delete(deleteDocs(Model))
router.route('/').get(fetchAll(Model))
router.route('/').post(createDoc(Model))
router.route('/:id').delete(deleteDoc(Model))
router.route('/:id').patch(updateDoc(Model))

module.exports = router
