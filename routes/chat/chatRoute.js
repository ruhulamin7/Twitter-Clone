const createChat = require('../../controllers/APIs/createChat');
const getSingleChat = require('../../controllers/APIs/getSingleChat');
const authChecker = require('../../middlewares/common/authChecker');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');

const chatRoute = require('express').Router();

// get message page
chatRoute.post(
  '/',
  decorateHTMLResponse(`Chat - ${process.env.APP_NAME}`),
  authChecker,
  createChat
);
// get single chat page
chatRoute.get(
  '/:chatId',
  decorateHTMLResponse(`Chat - ${process.env.APP_NAME}`),
  authChecker,
  getSingleChat
);

module.exports = chatRoute;
