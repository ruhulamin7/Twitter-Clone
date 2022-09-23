// dependencies
const express = require('express');
const dotenv = require('dotenv');
const {
  getLogin,
  getRegister,
} = require('../../controllers/auth/authControllers');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');
const authRoute = express.Router();
dotenv.config();

// get login page
authRoute.get(
  '/login',
  decorateHTMLResponse(`Login - ${process.env.APP_NAME}`),
  getLogin
);

// get register page
authRoute.get(
  '/register',
  decorateHTMLResponse(`Register - ${process.env.APP_NAME}`),
  getRegister
);

module.exports = {
    authRoute
};
