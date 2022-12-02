const createHttpError = require('http-errors');
const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const { cacheSetAndGet } = require('../../utils/cacheManager');

const getAllTweets = async (req, res, next) => {
  try {
    // const tweets = await cacheSetAndGet(`tweets`, async () => {
    //   return data;
    // });
    const result = await Tweet.find({}).populate({ path: 'tweetedBy' });
    // await User.populate(result, {
    //   path: 'tweetedBy',
    //   select: '-password',
    // });
    res.send(result);
  } catch (error) {
    next(createHttpError(500, error));
  }
};

module.exports = getAllTweets;
