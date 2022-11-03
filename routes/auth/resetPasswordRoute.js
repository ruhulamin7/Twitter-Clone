// dependencies.
const getResetPasswordPage = require('../../controllers/auth/getResetPasswordPage');
const resetPasswordHandler = require('../../controllers/auth/resetPasswordHandler');
const resetPasswordValidationResult = require('../../middlewares/auth/resetPasswordValidationResult');
const resetPasswordValidator = require('../../middlewares/auth/resetPasswordValidator');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');
const resetPasswordRoute = require('express').Router();

// get reset password page
resetPasswordRoute.get(
  '/reset-password',
  decorateHTMLResponse(`Reset Password - ${process.env.APP_NAME}`),
  getResetPasswordPage
);

// reset password handler
resetPasswordRoute.post(
  '/reset-password',
  decorateHTMLResponse(`Reset Password - ${process.env.APP_NAME}`),
  resetPasswordValidator(),
  resetPasswordValidationResult,
  resetPasswordHandler
);
// export
module.exports = resetPasswordRoute;
