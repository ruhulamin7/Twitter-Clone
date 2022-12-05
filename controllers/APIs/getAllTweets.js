const createHttpError = require('http-errors');
const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const { cacheSetAndGet } = require('../../utils/cacheManager');
const createTweet = require('./createTweet');

const getAllTweets = async (req, res, next) => {
  try {
    const result = await Tweet.find({});
    await User.populate(result, { path: 'tweetedBy' });
    await Tweet.populate(result, { path: 'originalTweet' });
    await Tweet.populate(result, { path: 'originalTweet.tweetedBy' });
    res.send(result);
  } catch (error) {
    next(createHttpError(500, error));
  }
};

module.exports = getAllTweets;
