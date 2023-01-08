const createHttpError = require('http-errors');
const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const { cacheSetAndGet } = require('../../utils/cacheManager');

const getAllTweets = async (req, res, next) => {
  try {
    const filterObj = {};
    req.query.tweetedBy && (filterObj.tweetedBy = req.query?.tweetedBy);

    req.query.replyTo &&
      (filterObj.replyTo =
        req.query?.replyTo === 'false'
          ? { $exists: false }
          : { $exists: true });

    // load following only tweets
    if (req.query.followingOnly && req.query.followingOnly === 'true') {
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
    }
    // tweet pin or not
    req.query.pinned &&
      req.query.pinned === 'true' &&
      (filterObj.pinned = true);

    const result = await Tweet.find(filterObj);

    // data populate
    await User.populate(result, { path: 'tweetedBy' });
    await Tweet.populate(result, { path: 'originalTweet' });
    await User.populate(result, { path: 'originalTweet.tweetedBy' });
    await Tweet.populate(result, { path: 'replyTo' });
    await User.populate(result, { path: 'replyTo.tweetedBy' });

    res.send(result);
  } catch (error) {
    next(createHttpError(500, error));
  }
};

module.exports = getAllTweets;
