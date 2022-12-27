const createHttpError = require('http-errors');
const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const { cacheSetAndGet } = require('../../utils/cacheManager');

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

    const user = await cacheSetAndGet(`users:${req.userId}`, async () => {
      const user = await User.findOne({ _id: req.userId });
      return user;
    });

    user.following = user.following || [];
    const followingUsers = [...user.following];
    followingUsers.push(user._id);

    req.query.followingOnly &&
      req.query.followingOnly === 'true' &&
      (filterObj.tweetedBy = { $in: followingUsers });

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
