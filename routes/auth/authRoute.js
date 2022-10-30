// dependencies
const express = require('express');
const dotenv = require('dotenv');
const getLoginPage = require('../../controllers/auth/getLoginPage');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');
const avatarUpload = require('../../middlewares/auth/avatarUpload');

const singUpDataValidationResult = require('../../middlewares/auth/singUpDataValidationResult');
const getRegisterPage = require('../../controllers/auth/getRegisterPage');
const registerHandler = require('../../controllers/auth/registerHandler');
const emailConfirmation = require('../../controllers/auth/emailConfirmation');
const loginHandler = require('../../controllers/auth/loginHandler');

const loginDataValidator = require('../../middlewares/auth/loginDataValidator');
const signUpDataValidator = require('../../middlewares/auth/signUpDataValidator');
const loginDataVAlidationResult = require('../../middlewares/auth/loginDataVAlidationResult');
const testLoginHandler = require('../../controllers/auth/testLoginHandler');
const authChecker = require('../../middlewares/common/authChecker');
const logout = require('../../controllers/auth/logout');
const resetPassword = require('../../controllers/auth/resetPassword');
const authRoute = express.Router();
dotenv.config();

// get login page
authRoute.get(
  '/login',
  decorateHTMLResponse(`Login - ${process.env.APP_NAME}`),
  authChecker,
  getLoginPage
);

// get register page
authRoute.get(
  '/register',
  decorateHTMLResponse(`Register - ${process.env.APP_NAME}`),
  authChecker,
  getRegisterPage
);

// register handler
authRoute.post(
  '/register',
  decorateHTMLResponse(`Register - ${process.env.APP_NAME}`),
  avatarUpload,
  signUpDataValidator(),
  singUpDataValidationResult,
  registerHandler
);

// email confirmation handler
authRoute.get('/email-confirmation/:id', emailConfirmation);

// reset password
authRoute.get('/reset-password', resetPassword);

// sign in handler
authRoute.post(
  '/login',
  decorateHTMLResponse(`Login - ${process.env.APP_NAME}`),
  loginDataValidator(),
  loginDataVAlidationResult,
  loginHandler
  // testLoginHandler
);

// logout current user
authRoute.get('/logout', logout);

// exports
module.exports = authRoute;
