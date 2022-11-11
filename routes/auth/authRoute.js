// dependencies
const express = require('express');
const getLoginPage = require('../../controllers/auth/getLoginPage');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');
const avatarUpload = require('../../middlewares/auth/avatarUpload');
const singUpDataValidationResult = require('../../middlewares/auth/singUpDataValidationResult');
const getRegisterPage = require('../../controllers/auth/getRegisterPage');
const registerHandler = require('../../controllers/auth/registerHandler');
const loginHandler = require('../../controllers/auth/loginHandler');
const loginDataValidator = require('../../middlewares/auth/loginDataValidator');
const signUpDataValidator = require('../../middlewares/auth/signUpDataValidator');
const loginDataValidationResult = require('../../middlewares/auth/loginDataValidationResult');
const authChecker = require('../../middlewares/common/authChecker');

require('dotenv').config();

const authRoute = express.Router();

// get register page
authRoute.get(
  '/register',
  decorateHTMLResponse(`Register - ${process.env.APP_NAME}`),
  authChecker,
  getRegisterPage
);

// get login page
authRoute.get(
  '/login',
  decorateHTMLResponse(`Login - ${process.env.APP_NAME}`),
  authChecker,
  getLoginPage
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

// sign in handler
authRoute.post(
  '/login',
  decorateHTMLResponse(`Login - ${process.env.APP_NAME}`),
  loginDataValidator(),
  loginDataValidationResult,
  loginHandler
  // testLoginHandler
);

// exports
module.exports = authRoute;
