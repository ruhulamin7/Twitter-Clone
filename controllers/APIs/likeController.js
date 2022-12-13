const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const { cacheSetAndGet, updateCacheData } = require('../../utils/cacheManager');
const { tweetPopulate } = require('../../utils/populator');

async function likeController(req, res, next) {
  try {
    const tweetId = req.params.id;
    const userId = req.userId;

    const user = await cacheSetAndGet(`users:${req.userId}`, async () => {
      const user = await User.findOne({ _id: req.userId });
      return user;
    });

    const isLiked = user.likes.includes(tweetId);
    const option = isLiked ? '$pull' : '$addToSet';

    // update tweet like
    const tweet = await Tweet.findOneAndUpdate(
      { _id: tweetId },
      { [option]: { likes: userId } },
      { new: true }
    );

    // populate data
    await tweetPopulate(tweet);
    // update tweet cache data
    updateCacheData(`tweets:${tweetId}`, tweet);
    // update user like
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { [option]: { likes: tweetId } },
      { new: true }
    );

    // update user cache data
    updateCacheData(`users:${userId}`, updatedUser);

    res.json(tweet);
  } catch (error) {
    next(error);
  }
}

module.exports = likeController;
