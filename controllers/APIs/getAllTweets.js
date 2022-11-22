const createHttpError = require('http-errors');
const Tweet = require('../../models/Tweet');
const User = require('../../models/User');

const getAllTweets = async (req, res, next) => {
  try {
    const result = await Tweet.find({});
    const tweets = await User.populate(result, {
      path: 'tweetedBy',
      select: '-password',
    });
    res.send(tweets);
  } catch (error) {
    next(createHttpError(500, error));
  }
};

module.exports = getAllTweets;
