// dependencies
const createHttpError = require('http-errors');
const User = require('../../models/User');
const { cacheSetAndGet } = require('../../utils/cacheManager');

// get home page
const getSingleTweetPage = async (req, res, next) => {
  const userId = req.userId;
  const tweetId = req.params.id;
  try {
    const user = await cacheSetAndGet(`users:${userId}`, async () => {
      const user = await User.findOne({ _id: userId }, { password: 0 });
      return user;
    });

    // user send to frontend js
    const userJs = JSON.stringify(user);

    return res.render('pages/singleTweet', {
      user: user ? user : {},
      otp: {},
      error: {},
      userJs,
      tweetId,
    });
  } catch (error) {
    next(createHttpError(500, error));
  }
};
// exports
module.exports = getSingleTweetPage;
