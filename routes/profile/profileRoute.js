const followController = require('../../controllers/APIs/followController');
const updateAvatarController = require('../../controllers/APIs/updateAvatarController');
const updateAvatar = require('../../controllers/APIs/updateAvatarController');
const updateCoverController = require('../../controllers/APIs/updateCoverController');
const getFollowers = require('../../controllers/follow/getFollowers');
const getFollowing = require('../../controllers/follow/getFollowing');
const getReplies = require('../../controllers/profile/getReplies');
const getTweets = require('../../controllers/profile/getTweets');
const updateCoverPhoto = require('../../middlewares/APIs/updateCoverPhoto');
const updateProfileAvatar = require('../../middlewares/APIs/updateProfileAvatar');
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

profileRoute.get(
  '/:username/following',
  decorateHTMLResponse(`Profile - ${process.env.APP_NAME}`),
  authChecker,
  getFollowing
);
profileRoute.get(
  '/:username/followers',
  decorateHTMLResponse(`Profile - ${process.env.APP_NAME}`),
  authChecker,
  getFollowers
);
profileRoute.put(
  '/avatar',
  decorateHTMLResponse(`Profile - ${process.env.APP_NAME}`),
  authChecker,
  updateProfileAvatar,
  updateAvatarController
);
profileRoute.put(
  '/cover',
  decorateHTMLResponse(`Profile - ${process.env.APP_NAME}`),
  authChecker,
  updateCoverPhoto,
  updateCoverController
);

// exports
module.exports = profileRoute;
