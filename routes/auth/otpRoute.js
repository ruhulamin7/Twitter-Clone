const verifyOTPHandler = require('../../controllers/auth/verifyOTPHandler');
const otpValidationResult = require('../../middlewares/auth/otpValidationResult');
const otpValidator = require('../../middlewares/auth/otpValidator');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');

// dependencies
const otpRoute = require('express').Router();

// verify OTP
otpRoute.post(
  '/verify-otp',
  decorateHTMLResponse(`Create New Password - ${process.env.APP_NAME}`),
  otpValidator(),
  otpValidationResult,
  verifyOTPHandler
);

// export
module.exports = otpRoute;
