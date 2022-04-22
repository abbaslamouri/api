// const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SK)
// const sgMail = require('@sendgrid/mail')
const AppError = require('../utils/AppError')
const sendEmail = require('../utils/Email')
const asyncHandler = require('../utils/asyncHandler')
const Product = require('../models/product')
const Order = require('../models/order')
const User = require('../models/user')

exports.updateOrder = asyncHandler(async (req, res, next) => {
  console.log('CREATING', req.body)
  let orderObj = { total: 0, items: [] }
  for (const prop in req.body.items) {
    const product = await Product.findById(req.body.items[prop].product._id)
    // console.log('PRODUCT', product)
    if (product) {
      orderObj.items[prop] = {
        product: product._id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        thumb:
          product.gallery && product.gallery[0] && product.gallery[0].url
            ? product.gallery[0].url
            : 'http://localhost:5000/placeholder.png',
        productType: product.productType,
        quantity: req.body.items[prop].quantity,
      }

      orderObj.total = orderObj.total + product.price * req.body.items[prop].quantity * 1
    }
  }
  orderObj.customer = req.body.customer._id ? req.body.customer : undefined
  orderObj.shippingAddress = req.body.customer.shippingAddresses.find((a) => a.selected == true)
  orderObj.status = req.body.status
  let order = {}
  if (req.body.id)
    order = await Order.findByIdAndUpdate(req.body.id, orderObj, {
      new: true, // Return new document
      runValidators: true,
    })
  else order = await Order.create(orderObj)
  console.log('OOOOOOO', order)
  if (!order) return next(new AppError(`We can't create order, please try again later`, 404))
  res.status(201).json({
    status: 'success',
    doc: order,
  })
})

exports.fetchPublishableKey = (Model) =>
  asyncHandler(async (req, res, next) => {
    res.status(200).json({
      status: 'success',
      publishableKey: process.env.STRIPE_PK,
    })
  })

exports.createPaymentIntent = (Model) =>
  asyncHandler(async (req, res, next) => {
    console.log('RRRRRRRRRRR', req.body)
    const order = await Order.findById(req.body.orderId)
    console.log('ORDER', order)

    order.status = 'payment'
    order.save()
    const paymentIntentPayload = {
      amount: order.total * 100,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        orderId: order.id,
      },
      setup_future_usage: 'on_session',
      // payment_method: 'pm_1Kr8dIKR1nb4cWr4ZTTMgb2x',
    }
    if (order.customer) paymentIntentPayload.customer = (await User.findById(order.customer)).stripeCustomerId
    console.log('FFFFFF', paymentIntentPayload)
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentPayload)
    console.log('PI', paymentIntent)
    res.status(200).json({
      status: 'success',
      clientSecret: paymentIntent.client_secret,
      // paymentIntent,
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
        console.log('SUCCESS', paymentIntent)
        const order = await Order.findById(paymentIntent.metadata.orderId)
        if (!order) return next()
        console.log('ORDER', order)
        order.status = 'processing'
        order.save()

        const emailPayload = {
          emailSubject: 'Thank you for your order',
          url: ``,
          items: order.items,
          total: order.total,
          orderNumber: order.id,
          date: new Date().toLocaleString(),
        }

        if (order.customer) {
          // authenticated (user with accounts)
          const user = await User.findById(order.customer)
          console.log('USER', user)
          emailPayload.name = user.name
          emailPayload.email = user.email
        } else {
          // authenticated (guest checkout)
          emailPayload.name = order.shippingAddress.name
          emailPayload.email = order.shippingAddress.email
        }
        console.log('PAYLOAD', emailPayload)
        await new sendEmail(emailPayload).sendOrderProcessing()
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
