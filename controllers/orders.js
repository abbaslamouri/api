const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SK)
const AppError = require('../utils/AppError')
const asyncHandler = require('../utils/asyncHandler')
const Product = require('../models/product')

exports.buildOrder = asyncHandler(async (req, res, next) => {
  console.log('CREATING', req.body)
  const items = req.body.items
  const order = { total: 0, items: [] }
  for (const prop in items) {
    const product = await Product.findById(items[prop].product._id)
    if (!product) return next(new AppError(`We can't find a document with id = ${items[prop].product._id}`, 404))
    order.items[prop] = {
      product: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      thumb: product.gallery && product.gallery[0] && product.gallery[0].path ? product.gallery[0].path : '',
      productType: product.productType,
      quantity: items[prop].quantity,
    }
    order.total = order.total + product.price * items[prop].quantity * 1
  }
  order.customer = req.body.customer._id
  order.shippingAddress = req.body.customer.shippingAddresses.find((a) => a.selected == true)
  order.status = req.body.status
  req.body = order
  console.log('OOOOOOO', order)
  next()

  // const doc = await Model.create(req.body)
  // if (!doc) return next(new AppError(`We can't create document ${req.body.name}`, 404))
  // res.status(201).json({
  //   status: 'success',
  //   doc,
  // })
})

// exports.updateOrder = (Model) =>
//   asyncHandler(async (req, res, next) => {
//     const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
//       new: true, // Return new document
//       runValidators: true,
//     })
//     if (!doc) return next(new AppError(`We can't find a document with id = ${req.params.id}`, 404))
//     res.status(200).json({
//       status: 'success',
//       doc,
//     })
//   })

exports.fetchPublishableKey = (Model) =>
  asyncHandler(async (req, res, next) => {
    res.status(200).json({
      status: 'success',
      publishableKey: process.env.STRIPE_PK,
    })
  })

exports.createPaymentIntent = (Model) =>
  asyncHandler(async (req, res, next) => {
    console.log('RB', req.body)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.total * 100,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        email: req.body.email,
        name: req.body.shippingAddress.name,
        addressLine1: req.body.shippingAddress.addressLine1,
        addressLine2: req.body.shippingAddress.addressLine2,
        city: req.body.shippingAddress.city,
        state: req.body.shippingAddress.state.name,
        postalCode: req.body.shippingAddress.postalCode,
        country: req.body.shippingAddress.country.countryName,
      },
    })
    res.status(200).json({
      status: 'success',
      clientSecret: paymentIntent.client_secret,
      paymentIntent,
    })
  })

exports.handleWebhook = (Model) =>
  asyncHandler(async (req, res, next) => {
    const endpointSecret = process.env.STRIPE_WSK
    let event = req.body
    // console.log('REQBODY', req.body)
    // console.log('REQHEADERS', req.headers)

    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers['stripe-signature']
      try {
        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret)
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message)
        return res.sendStatus(400)
      }
    }

    // Handle the event
    let paymentIntent = null
    switch (event.type) {
      case 'payment_intent.succeeded':
        paymentIntent = event.data.object
        console.log(`[${event.id}] PaymentIntent for ${paymentIntent.amount} was successful! : ${paymentIntent.status}`)
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break

      case 'payment_intent.created':
        paymentIntent = event.data.object
        console.log(
          `[${event.id}] PaymentIntent for ${paymentIntent.amount} was successful! : ${paymentIntent.status} `
        )
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break

      case 'payment_intent.processing':
        paymentIntent = event.data.object
        console.log(`[${event.id}] PaymentIntent for ${paymentIntent.amount} was successful!: ${paymentIntent.status}`)
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break

      case 'payment_method.attached':
        const paymentMethod = event.data.object
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break
      default:
        // Unexpected event type

        console.log(`Unhandled event type ${event.type}.`)
    }
    // console.log('EEEEEEEEEEEEEE', paymentIntent)

    res.send()
  })
