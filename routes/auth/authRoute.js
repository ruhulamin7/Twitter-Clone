// dependencies
const express = require('express');
const getLoginPage = require('../../controllers/auth/getLoginPage');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');
const avatarUpload = require('../../middlewares/auth/avatarUpload');

const getRegisterPage = require('../../controllers/auth/getRegisterPage');
const registerHandler = require('../../controllers/auth/registerHandler');
const loginHandler = require('../../controllers/auth/loginHandler');
const loginDataValidator = require('../../middlewares/auth/loginDataValidator');

const authChecker = require('../../middlewares/common/authChecker');
const loginDataValidationResult = require('../../middlewares/auth/loginDataValidationResult');
const registerDataValidator = require('../../middlewares/auth/registerDataValidator');
const registerDataValidationResult = require('../../middlewares/auth/registerDataValidationResult');
const usernameValidator = require('../../controllers/auth/usernameValidator');
const emailValidator = require('../../controllers/auth/emailValidator');

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
  registerDataValidator(),
  registerDataValidationResult,
  registerHandler
);

// sign in handler
authRoute.post(
  '/login',
  decorateHTMLResponse(`Login - ${process.env.APP_NAME}`),
  loginDataValidator(),
  loginDataValidationResult,
  loginHandler
);
// username validation
authRoute.get(`/username/:username`, usernameValidator);
// email validation
authRoute.get(`/email/:email`, emailValidator);

// exports
module.exports = authRoute;
