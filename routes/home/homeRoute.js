const getHomePage = require('../../controllers/home/getHomePage');
const authChecker = require('../../middlewares/common/authChecker');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');
// require('dotenv').config();

// dependencies
const homeRoute = require('express').Router();

homeRoute.get(
  '/',
  decorateHTMLResponse(`Home - ${process.env.APP_NAME}`),
  authChecker,
  getHomePage
);
homeRoute.get(
  '/home',
  decorateHTMLResponse(`Home - ${process.env.APP_NAME}`),
  authChecker,
  getHomePage
);

// exports
module.exports = homeRoute;
