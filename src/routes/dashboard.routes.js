const router = require('express').Router();
const {adminSignup}=require('../controllers/dashboard.controller')

// routes for inventory upload
router.route('/admin/signup').get(adminSignup);

module.exports = router;
