const express = require('express')
const { fetchAll, fetchDoc, createDoc, updateDoc, deleteDoc } = require('../controllers/factory')
const { updateOrder, createPaymentIntent, fetchPublishableKey, handleWebhook } = require('../controllers/orders')
const Model = require('../models/order')

const router = express.Router()
router.route('/webhook').post(express.raw({ type: 'application/json' }), handleWebhook(Model))
router.route('/publishableKey').get(fetchPublishableKey(Model))
router.route('/').get(fetchAll(Model))
router.route('/:id').get(fetchDoc(Model))
router.route('/').post(updateOrder)
router.route('/secret').post(createPaymentIntent(Model))
router.route('/:id').delete(deleteDoc(Model))
router.route('/:id').patch(updateOrder)

module.exports = router
