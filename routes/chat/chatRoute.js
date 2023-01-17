const createChat = require('../../controllers/APIs/createChat');
const authChecker = require('../../middlewares/common/authChecker');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');

const chatRoute = require('express').Router();

// get message page
chatRoute.post(
  '/',
  decorateHTMLResponse(`Message - ${process.env.APP_NAME}`),
  authChecker,
  createChat
);

module.exports = chatRoute;
