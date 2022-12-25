const createHttpError = require('http-errors');
const Tweet = require('../../models/Tweet');
const User = require('../../models/User');

const getAllTweets = async (req, res, next) => {
  try {
    console.log(req.query);
    const filterObj = {};
    req.query.tweetedBy && (filterObj.tweetedBy = req.query?.tweetedBy);
    req.query.replayTo &&
      (filterObj.replayTo =
        req.query?.replayTo === 'false'
          ? { $exists: false }
          : { $exists: true });

    const result = await Tweet.find(filterObj);

    await User.populate(result, { path: 'tweetedBy' });
    await Tweet.populate(result, { path: 'originalTweet' });
    await User.populate(result, { path: 'originalTweet.tweetedBy' });
    await Tweet.populate(result, { path: 'replayTo' });
    await User.populate(result, { path: 'replayTo.tweetedBy' });
    res.send(result);
  } catch (error) {
    next(createHttpError(500, error));
  }
};

module.exports = getAllTweets;
