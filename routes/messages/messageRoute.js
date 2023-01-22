const authChecker = require('../../middlewares/common/authChecker');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');
const getMessagePage = require('../../controllers/messages/getMessagePage');
const createChatGroupPage = require('../../controllers/messages/getChatGroupPage');
const getChatPage = require('../../controllers/messages/getChatPage');
const getAllChat = require('../../controllers/APIs/getAllChat');

const messageRoute = require('express').Router();

// get message page
messageRoute.get(
  '/',
  decorateHTMLResponse(`Message - ${process.env.APP_NAME}`),
  authChecker,
  getMessagePage
);

// get create chat group page
messageRoute.get(
  '/create-chat-group',
  decorateHTMLResponse(`Message - ${process.env.APP_NAME}`),
  authChecker,
  createChatGroupPage
);
// get chat page
messageRoute.get(
  '/:chatId',
  decorateHTMLResponse(`Message - ${process.env.APP_NAME}`),
  authChecker,
  getChatPage
);

module.exports = messageRoute;
