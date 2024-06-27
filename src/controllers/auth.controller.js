const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;
const logger = require('../middleware/winston.logger');
const { errorResponse, successResponse } = require('../configs/app.response');
const loginResponse = require('../configs/login.response');
const { sendOTP, verifyOTP } = require('../configs/otp.service.js');

// TODO: Controller for phone verification
exports.sendLoginOtp = async function (req, res) {
    try {
        let { phone } = req.body;
        const countryCode = 91;
        if (!phone) {
            return res.status(400).json(errorResponse(
                1,
                'ERROR',
                'Phone can not be empty'
            ));
        }

        await sendOTP(phone, countryCode).then((isSent) => {

            if (!isSent) {
                res.status(500).json(errorResponse(
                    8,
                    'OTP ERROR',
                    'Unable to generate OTP'
                ));
            }
            if (isSent) {
                res.status(200).json(successResponse(
                    9,
                    'SUCCESS',
                    'OTP Sent',
                    `+${countryCode}${phone}`
                ))
            }
        })

    } catch (error) {
        logger.error('Error in sendLoginOtp: ', error);
        return res.status(500).json(errorResponse(
            2,
            'SERVER ERROR',
            error.message || "Internal Server Error"
        ));
    }
}

// TODO: COntroller for user creation or login after phone verification
exports.verifyLoginOtp = async function (req, res) {
    try {
        let { phone, otp } = req.body
        const countryCode = 91;

        if (!phone) {
            return res.status(400).json(errorResponse(
                1,
                'ERROR',
                'Phone can not be empty'
            ));
        }

        if (!otp) {
            return res.status(400).json(errorResponse(
                1,
                'OTP ERROR',
                'OTP can not be empty'
            ));
        }

        let isOtpVeified = await verifyOTP(phone, countryCode, otp)

        if (!isOtpVeified) {
            return res.status(500).json(errorResponse(
                8,
                'OTP ERROR',
                "Wrong OTP entered!"
            ));
        }

        if (isOtpVeified) {
            const existingUser = await Users.findOne({
                where: {
                    phone: phone,
                    country_code: countryCode
                }
            });

            if (existingUser.isBlocked) {
                return res.status(406).json(errorResponse(
                    6,
                    'UNABLE TO ACCESS',
                    'Accessing the page or resource you were trying to reach is forbidden'
                ));
            }

            if (existingUser) {
                Users.update({ status: 'login' }, {
                    where: { id: existingUser.id }
                }).then(() => {
                    existingUser.status = 'login';
                    return loginResponse(res, existingUser);
                })
            } else {
                const user = {
                    phone,
                    country_code: countryCode,
                    status: 'login'
                };
                const newUser = await Users.create(user);
                return loginResponse(res, newUser);
            }
        }
    } catch (error) {
        logger.error('Error in verifyLoginOtp: ', error);
        return res.status(500).json(errorResponse(
            2,
            'SERVER ERROR',
            error.message || "Internal Server Error"
        ));
    }
}

// TODO: Controller for logout user
exports.logoutUser = async (req, res) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(404).json(errorResponse(
                4,
                'UNKNOWN ACCESS',
                'Unauthorized access. Please login to continue'
            ));
        }

        // update user status & updateAt time

        await Users.update({ status: 'logout' }, {
            where: { id: user.id }
        })

        // remove cookie
        res.clearCookie('AccessToken');

        // response user
        res.status(200).json(successResponse(
            0,
            'SUCCESS',
            'User logged out successful'
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            2,
            'SERVER SIDE ERROR',
            error
        ));
    }
};

// TODO: Controller for user refresh-token
exports.refreshToken = async (req, res) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(404).json(errorResponse(
                4,
                'UNKNOWN ACCESS',
                'User does not exist'
            ));
        }

        const accessToken = user.getJWTToken();
        const refreshToken = user.getJWTRefreshToken();

        // options for cookie
        const options = {
            expires: new Date(Date.now() + process.env.JWT_TOKEN_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res
            .status(200)
            .cookie('AccessToken', accessToken, options)
            .json(successResponse(
                0,
                'SUCCESS',
                'JWT refreshToken generate successful',
                { accessToken, refreshToken }
            ));
    } catch (error) {
        res.status(500).json(errorResponse(
            2,
            'SERVER SIDE ERROR',
            error
        ));
    }
};