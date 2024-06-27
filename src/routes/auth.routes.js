const router = require('express').Router();
const { apiLimiter, sendOTPLimiter } = require('../middleware/access.limiter');
const { isAuthenticatedUser, isRefreshTokenValid, isBlocked } = require('../middleware/app.authentication');
const { sendLoginOtp, verifyLoginOtp, logoutUser, refreshToken } = require('../controllers/auth.controller');

// routes for register, login and logout user
router.route('/auth/mobile/send-otp').post(sendOTPLimiter, sendLoginOtp);
router.route('/auth/mobile/verify-otp').post(apiLimiter, verifyLoginOtp);
router.route('/auth/logout').post(isAuthenticatedUser, isBlocked, logoutUser);

// route for get user refresh JWT Token
router.route('/auth/refresh-token').get(isRefreshTokenValid, refreshToken);

module.exports = router;