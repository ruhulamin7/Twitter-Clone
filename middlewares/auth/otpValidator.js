// dependencies
const { check } = require('express-validator');
const OTP = require('../../models/OTP');
// OTP validator
const otpValidator = () => {
  return [
    check('otp')
      .notEmpty()
      .withMessage('Please input OTP')
      .trim()
      .custom(async (value, { req }) => {
        const userOTP = value;
        const email = req.body?.email;
        const otpId = req.body?.otpId;

        const otpObj = await OTP.findOne({
          $and: [{ otpId, email, OTP: userOTP }],
        });
        if (
          otpObj.expireIn.getTime() > Date.now() &&
          otpObj.OTP === Number(userOTP)
        ) {
          const result = await OTP.findOneAndUpdate(
            { _id: otpId },
            { status: true },
            { new: true }
          );
          if (result) {
            req.isValidOtp = true;
            return Promise.resolve();
          }
          {
            return Promise.reject();
          }
        } else {
          return Promise.reject();
        }
      })
      .withMessage('Invalid OTP!'),
  ];
};
// exports
module.exports = otpValidator;
