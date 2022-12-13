const createHttpError = require('http-errors');
const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const { cacheSetAndGet } = require('../../utils/cacheManager');
const { tweetPopulate } = require('../../utils/populator');
const createTweet = require('./createTweet');

const getSingleTweet = async (req, res, next) => {
  try {
    const tweet = await cacheSetAndGet(`tweets:${req.params.id}`, async () => {
      const result = await Tweet.findOne({ _id: req.params.id });
      await tweetPopulate(result);
      return result;
    });
    res.send(tweet);
  } catch (error) {
    next(createHttpError(500, error));
  }
};

module.exports = getSingleTweet;
