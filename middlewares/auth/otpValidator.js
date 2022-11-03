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
        const otp = value;
        const email = req.body?.email;
        const otpId = req.body?.otpId;

        const otpObj = await OTP.findOne({
          $and: [{ otpId, email, OTP: otp }],
        });
        if (
          otpObj.expireIn.getTime() > Date.now() &&
          otpObj.OTP === Number(otp)
        ) {
          const result = await OTP.findOneAndUpdate(
            { _id: otpId },
            { status: true },
            { new: true }
          );
          if (result) {
            // set req data
            req.isValidOtp = true;
            req.otp = value;
            req.otpId = otpId;
            req.email = email;
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
