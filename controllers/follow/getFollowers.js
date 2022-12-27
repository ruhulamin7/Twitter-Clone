// dependencies
const createHttpError = require('http-errors');
const User = require('../../models/User');
const { cacheSetAndGet } = require('../../utils/cacheManager');

// get home page
const getFollowers = async (req, res, next) => {
  try {
    const user = await cacheSetAndGet(`users:${req.userId}`, async () => {
      const user = await User.findOne({ _id: req.userId }, { password: 0 });
      return user;
    });

    const userProfile = await User.findOne(
      { username: req.params.username },
      { password: 0 }
    );

    await User.populate(userProfile, { path: 'following' });
    await User.populate(userProfile, { path: 'followers' });

    // user send to frontend js
    const userJs = JSON.stringify(user);
    const userProfileJs = JSON.stringify(userProfile);

    return res.render('pages/follow/follow', {
      user: user ? user : {},
      otp: {},
      error: {},
      userJs,
      userProfile,
      userProfileJs,
      tab: 'followers',
    });
  } catch (error) {
    next(createHttpError(500, error));
  }
};
// exports
module.exports = getFollowers;
