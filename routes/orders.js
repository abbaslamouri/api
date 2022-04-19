const express = require('express')
const { fetchAll, deleteDoc } = require('../controllers/factory')
const {
  createOrder,
  updateOrder,
  createPaymentIntent,
  fetchPublishableKey,
  handleWebhook,
} = require('../controllers/orders')
const Model = require('../models/order')

const router = express.Router()
router.route('/webhook').post(express.raw({ type: 'application/json' }), handleWebhook(Model))
router.route('/publishableKey').get(fetchPublishableKey(Model))
router.route('/').get(fetchAll(Model))
router.route('/').post(createOrder(Model))
router.route('/secret').post(createPaymentIntent(Model))
router.route('/:id').delete(deleteDoc(Model))
router.route('/:id').patch(updateOrder(Model))

module.exports = router
