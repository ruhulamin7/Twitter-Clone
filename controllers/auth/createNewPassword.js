const createHttpError = require('http-errors');
const User = require('../../models/User');
const hashPassword = require('../../utils/hashPassword');
const jwt = require('jsonwebtoken');
const OTP = require('../../models/OTP');

const createNewPassword = async (req, res, next) => {
  console.log(req.body);
  try {
    const otp = req.body.otp;
    const otpId = req.body.otpId;
    const email = req.body.email;
    const password = req.body.password;

    const otpObj = await OTP.findOne({ _id: otpId });

    if (Number(otp) === otpObj.OTP && otpObj.status === true) {
      const hashString = await hashPassword(password);
      const result = await User.findOneAndUpdate(
        { email: otpObj.email },
        { $set: { password: hashString } },
        { new: true }
      );

      const token = jwt.sign(
        {
          username: result.username,
          userId: result._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );
      // send cookie
      res.status(200);
      res.cookie('access_token', 'Bearer ' + token, { signed: true });
      res.redirect('/');
    }
  } catch (error) {
    next(createHttpError(500, error));
  }
};

// export
module.exports = createNewPassword;
