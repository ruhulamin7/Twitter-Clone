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
const loginDataVAlidationResult = require('../../middlewares/auth/loginDataVAlidationResult');
const authChecker = require('../../middlewares/common/authChecker');
const logout = require('../../controllers/auth/logout');

const authRoute = express.Router();

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

// sign in handler
authRoute.post(
  '/login',
  decorateHTMLResponse(`Login - ${process.env.APP_NAME}`),
  loginDataValidator(),
  loginDataVAlidationResult,
  loginHandler
  // testLoginHandler
);

// exports
module.exports = authRoute;
