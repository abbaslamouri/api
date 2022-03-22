const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')
const Tour = require('../../models/tour')
// const User = require('../../models/userModel')
// const Review = require('../../models/reviewModel')

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
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
// const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))

// Import data into db
const importData = async () => {
  try {
    const docs = await Tour.create(tours)
    // await User.create(users, {validateBeforeSave: false})
    // await Review.create(reviews)
    console.log(colors.green.bold(`${docs.length} tours created successfully...`))

    // console.log(colors.green.bold('Data uploaded to database successfully...'))
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

// Delete all data from db
const deleteData = async () => {
  try {
    const deleted = await Tour.deleteMany()
    // await User.deleteMany()
    // await Review.deleteMany()
    console.log(colors.green.bold(`${deleted.deletedCount} tours deleted from the database successfully...`))
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
