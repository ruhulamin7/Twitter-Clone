const createHttpError = require('http-errors');
const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const { cacheSetAndGet } = require('../../utils/cacheManager');

const getAllTweets = async (req, res, next) => {
  try {
    const tweets = await cacheSetAndGet(`tweets`, async () => {
      const result = await Tweet.find({});
      const data = await User.populate(result, {
        path: 'tweetedBy',
        select: '-password',
      });
      return data;
    });
    res.send(tweets);
  } catch (error) {
    next(createHttpError(500, error));
  }
};

module.exports = getAllTweets;
