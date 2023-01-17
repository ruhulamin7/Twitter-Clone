const getTweetSearch = require('../../controllers/search/getTweetSearch');
const getUsers = require('../../controllers/APIs/getUsers');
const getUserSearch = require('../../controllers/search/getUserSearch');
const authChecker = require('../../middlewares/common/authChecker');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');
const getMessagePage = require('../../controllers/messages/getMessagePage');
const getNewMessagePage = require('../../controllers/messages/getNewMessagePage');

const messageRoute = require('express').Router();

// get message page
messageRoute.get(
  '/',
  decorateHTMLResponse(`Message - ${process.env.APP_NAME}`),
  authChecker,
  getMessagePage
);

// get new message page
messageRoute.get(
  '/new',
  decorateHTMLResponse(`Message - ${process.env.APP_NAME}`),
  authChecker,
  getNewMessagePage
);

module.exports = messageRoute;
