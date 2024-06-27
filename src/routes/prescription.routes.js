const router = require('express').Router();
const { uploadPrescriptionImage } = require('../controllers/prescription.controller')
const prescriptionImageUpload = require('../middleware/prescription.image.upload')
const { isAuthenticatedUser, isBlocked } = require('../middleware/app.authentication');

// routes for prescription images upload
router.route('/upload/prescription').post(isAuthenticatedUser, isBlocked, prescriptionImageUpload.array('prescription_images', 5), uploadPrescriptionImage );


module.exports = router;