// dependencies
const newPasswordRoute = require('express').Router();
const createNewPassword = require('../../controllers/auth/createNewPassword');
const newPasswordValidationResult = require('../../middlewares/auth/newPasswordValidationResult');
const newPasswordValidator = require('../../middlewares/auth/newPasswordValidator');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');

// create new password
newPasswordRoute.post(
  '/create-new-password',
  decorateHTMLResponse(`Create New Password - ${process.env.APP_NAME}`),
  newPasswordValidator(),
  newPasswordValidationResult,
  createNewPassword
);

// export
module.exports = newPasswordRoute;
