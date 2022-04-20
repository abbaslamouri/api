const express = require('express')
const { fetchAll, createDoc, updateDoc, deleteDoc } = require('../controllers/factory')
const { buildOrder, createPaymentIntent, fetchPublishableKey, handleWebhook } = require('../controllers/orders')
const Model = require('../models/order')

const router = express.Router()
router.route('/webhook').post(express.raw({ type: 'application/json' }), handleWebhook(Model))
router.route('/publishableKey').get(fetchPublishableKey(Model))
router.route('/').get(fetchAll(Model))
router.route('/').post(buildOrder, createDoc(Model))
router.route('/secret').post(buildOrder, createPaymentIntent(Model))
router.route('/:id').delete(deleteDoc(Model))
router.route('/:id').patch(buildOrder, updateDoc(Model))

module.exports = router
