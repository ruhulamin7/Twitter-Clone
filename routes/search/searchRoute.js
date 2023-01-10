const getTweetSearch = require('../../controllers/search/getTweetSearch');
const getUserSearch = require('../../controllers/search/getUserSearch');
const authChecker = require('../../middlewares/common/authChecker');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');

const searchRoute = require('express').Router();

searchRoute.get(
  '/',
  decorateHTMLResponse(`Search - ${process.env.APP_NAME}`),
  authChecker,
  getTweetSearch
);
searchRoute.get(
  '/users',
  decorateHTMLResponse(`Search - ${process.env.APP_NAME}`),
  authChecker,
  getUserSearch
);

module.exports = searchRoute;
