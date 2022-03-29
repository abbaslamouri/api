const express = require('express')
const { saveFile, deleteFile } = require('../controllers/media')
const { fetchAll, createDoc, updateDoc, deleteDoc } = require('../controllers/factory')
const Folder = require('../models/folder')
const Media = require('../models/media')

const router = express.Router()

router.route('/folders').get(fetchAll(Folder))
router.route('/folders/').post(createDoc(Folder))
router.route('/folders/:id').patch(updateDoc(Folder))
router.route('/folders/:id').delete(deleteDoc(Folder))
router.route('/').get(fetchAll(Media))
router.route('/').post(saveFile)
router.route('/:id').delete(deleteFile)
// router.route('/signout').get(signout)
// router.route('/forgotPassword').post(forgotPassword)
// router.route('/resetPassword/:token').patch(resetPassword)

// router.use(protect)

// router.route('/updateLoggedInPassword').patch(updateLoggedInPassword)

module.exports = router
