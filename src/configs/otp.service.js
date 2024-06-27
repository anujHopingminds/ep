const logger = require('../middleware/winston.logger');

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const verifySid = process.env.TWILIO_ACCOUNT_VERIFY_SID

const client = require('twilio')(accountSid, authToken)

/**
 * function to send otp to the use user mobile number
 * @param {Number} phone Phone number of the user
 * @param {Number} countryCode Country code of the user
 * @returns true/false
 */
async function sendOTP(phone, countryCode) {
    try {
        if (process.env.APP_NODE_ENV === "development") {
            return true
        }
        await client.verify.v2
            .services(verifySid)
            .verifications.create({ to: `+${countryCode}${phone}`, channel: 'sms' });
        return true;
    } catch (error) {
        logger.error('Error in OTP Generation: ', error);
        return false;
    }
}

/**
 * 
 * @param {Number} phone Phone number of the user
 * @param {Number} countryCode Country code of the user
 * @param {Number} otp otp recieved by the user
 * @returns true/false
 */
async function verifyOTP(phone, countryCode, otp) {
    try {
        if (process.env.APP_NODE_ENV === "development") {
            return true
        }
        await client.verify.v2
            .services(verifySid)
            .verificationChecks.create({
                to: `+${countryCode}${phone}`,
                code: otp,
            });

        return true;
    } catch (error) {
        logger.error('Error in OTP Verification: ', error);
        return false;
    }
}

module.exports = { sendOTP, verifyOTP }