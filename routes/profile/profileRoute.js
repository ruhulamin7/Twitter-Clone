const followController = require('../../controllers/APIs/followController');
const getReplies = require('../../controllers/profile/getReplies');
const getTweets = require('../../controllers/profile/getTweets');
const authChecker = require('../../middlewares/common/authChecker');
const decorateHTMLResponse = require('../../middlewares/common/decorateHTMLResponse');
// require('dotenv').config();

// dependencies
const profileRoute = require('express').Router();

profileRoute.get(
  '/:username',
  decorateHTMLResponse(`Profile - ${process.env.APP_NAME}`),
  authChecker,
  getTweets
);

profileRoute.get(
  '/:username/replies',
  decorateHTMLResponse(`Profile - ${process.env.APP_NAME}`),
  authChecker,
  getReplies
);

profileRoute.put(
  '/:id/follow',
  decorateHTMLResponse(`Profile - ${process.env.APP_NAME}`),
  authChecker,
  followController
);

// exports
module.exports = profileRoute;
