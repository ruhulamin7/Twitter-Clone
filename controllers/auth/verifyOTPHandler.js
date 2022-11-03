const createHttpError = require('http-errors');
const OTP = require('../../models/OTP');
const User = require('../../models/User');

const verifyOTPHandler = async (req, res, next) => {
  try {
    if (req.isValidOtp) {
      res.render('pages/auth/createNewPassword', { email: {} });
    } else {
      next(createHttpError(500, 'Internal Server Error!'));
    }
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error!'));
  }
};
//export
module.exports = verifyOTPHandler;
