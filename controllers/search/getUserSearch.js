const createHttpError = require('http-errors');
const User = require('../../models/User');
const { cacheSetAndGet } = require('../../utils/cacheManager');

const getUserSearch = async (req, res, next) => {
  try {
    const user = await cacheSetAndGet(`users:${req.userId}`, async () => {
      const user = await User.findOne({ _id: req.userId }, { password: 0 });
      return user;
    });

    // user send to frontend js
    const userJs = JSON.stringify(user);

    return res.render('pages/search/search', {
      user: user ? user : {},
      error: {},
      userJs,
      tab: 'users',
    });
  } catch (error) {
    next(createHttpError(500, error));
  }
};

module.exports = getUserSearch;
