// dependencies

const { validationResult } = require('express-validator');
const createHttpError = require('http-errors');

const otpValidationResult = (req, res, next) => {
  console.log('body', req.body);
  try {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
      next();
    } else {
      res.render('pages/auth/verifyOTP', {
        error: mappedErrors,
        otp: {
          value: req.body.otp,
          otpId: req.body.otpId,
          email: req.body.email,
        },
      });
    }
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error!'));
  }
};

// exports
module.exports = otpValidationResult;
