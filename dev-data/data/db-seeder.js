const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')
const Tour = require('../../models/tour')
const User = require('../../models/user')
const Review = require('../../models/review')
const Country = require('../../models/country')
const State = require('../../models/state')
const Order = require('../../models/order')

dotenv.config({ path: './config.env' })

const db = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD)
mongoose.connect(db, {}).then(
	() => {
		console.log(colors.magenta.bold(`Database connection succesfull`))
	},
	(err) => {
		console.log(colors.red.bold('Mongo DB Error', err))
		console.log(colors.red.bold('Mongo DB Error Message', err.message))
	}
)

// Read data from file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))
const countries = JSON.parse(fs.readFileSync(`${__dirname}/countries.json`, 'utf-8'))
const states = JSON.parse(fs.readFileSync(`${__dirname}/states.json`, 'utf-8'))
const orders = JSON.parse(fs.readFileSync(`${__dirname}/orders.json`, 'utf-8'))

// Import data into db
const importData = async () => {
	try {
		// const toursCreated = await Tour.create(tours)
		// console.log(colors.green.bold(`${toursCreated.length} tours created successfully...`))

		// const usersCreated = await User.create(users, { validateBeforeSave: false })
		// console.log(colors.green.bold(`${usersCreated.length} users created successfully...`))

		// const reviewsCreated = await Review.create(reviews)
		// console.log(colors.green.bold(`${reviewsCreated.length} reviews created successfully...`))

		const countriesCreated = await Country.create(countries)
		console.log(colors.green.bold(`${countriesCreated.length} countries created successfully...`))

		const statesCreated = await State.create(states)
		console.log(colors.green.bold(`${statesCreated.length} states created successfully...`))

		// const ordersCreated = await Order.create(orders)
		// console.log(colors.green.bold(`${ordersCreated.length} orders created successfully...`))
	} catch (error) {
		console.log(error)
	}
	process.exit()
}

// Delete all data from db
const deleteData = async () => {
	try {
		// const deletedTours = await Tour.deleteMany()
		// console.log(colors.green.bold(`${deletedTours.deletedCount} tours deleted from the database successfully...`))

		// const deletedUsers = await User.deleteMany()
		// console.log(colors.green.bold(`${deletedUsers.deletedCount} users deleted from the database successfully...`))

		// const deletedReviews = await Review.deleteMany()
		// console.log(colors.green.bold(`${deletedReviews.deletedCount} reviews deleted from the database successfully...`))

		const deletedCountries = await Country.deleteMany()
		console.log(
			colors.green.bold(`${deletedCountries.deletedCount} countries deleted from the database successfully...`)
		)

		const deletedStates = await State.deleteMany()
		console.log(colors.green.bold(`${deletedStates.deletedCount} states deleted from the database successfully...`))

		const deletedOrders = await Order.deleteMany()
		console.log(colors.green.bold(`${deletedOrders.deletedCount} orders deleted from the database successfully...`))
	} catch (error) {
		console.log(error)
	}
	process.exit()
}

if (process.argv[2] === '--import') {
	importData()
} else if (process.argv[2] === '--delete') {
	deleteData()
}

console.log(process.argv)
