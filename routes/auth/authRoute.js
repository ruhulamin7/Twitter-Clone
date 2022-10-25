// dependencies
const express = require('express');
const dotenv = require('dotenv');
const getLoginPage = require('../../controllers/auth/getLoginPage');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');
const avatarUpload = require('../../middlewares/auth/avatarUpload');
const signUpDataValidator = require('../../middlewares/auth/signupDataValidator');
const singUpDataValidationResult = require('../../middlewares/auth/singUpDataValidationResult');
const getRegisterPage = require('../../controllers/auth/getRegisterPage');
const registerHandler = require('../../controllers/auth/registerHandler');
const authRoute = express.Router();
dotenv.config();

// get login page
authRoute.get(
  '/login',
  decorateHTMLResponse(`Login - ${process.env.APP_NAME}`),
  getLoginPage
);

// get register page
authRoute.get(
  '/register',
  decorateHTMLResponse(`Register - ${process.env.APP_NAME}`),
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

// exports
module.exports = authRoute;
