const createHttpError = require('http-errors');
const OTP = require('../../models/OTP');
const User = require('../../models/User');
const sendEmail = require('../../utils/sendEmail');

const resetPasswordHandler = async (req, res, next) => {
  const email = req.body.email;

  if (email) {
    const otpObject = new OTP({
      OTP: Math.floor(Math.random() * 9000 + 1000),
      email: email,
      expireIn: Date.now() + 120000,
    });

    const result = await otpObject.save();
    // send otp to user
    sendEmail(
      [email],
      {
        subject: 'Reset your password',
        template: `Your OTP is ${result.OTP}`,
        attachments: [],
      },

      function (err, info) {
        if (info?.messageId) {
          res.render('pages/auth/verifyOTP', {
            error: {},
            otp: { value: null, otpId: result._id, email: result.email },
          });
        } else {
          next(createHttpError(500, 'Internal server error!'));
        }
      }
    );
  }
};

// exports
module.exports = resetPasswordHandler;
