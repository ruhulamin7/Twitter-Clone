const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const { cacheSetAndGet, updateCacheData } = require('../../utils/cacheManager');
const { tweetPopulate } = require('../../utils/populator');

async function pinController(req, res, next) {
  try {
    const tweetId = req.params.id;
    const userId = req.userId;

    let tweet = await cacheSetAndGet(`tweets:${tweetId}`, async () => {
      const newData = await Tweet.findOne({ _id: tweetId });
      return newData;
    });

    if (tweet.pinned) {
      tweet = await Tweet.findOneAndUpdate(
        { _id: tweetId, tweetedBy: userId },
        { $set: { pinned: false } },
        { new: true }
      );
      await tweetPopulate(tweet);
      updateCacheData(`tweets:${tweet._id}`, tweet);
    } else {
      const previousPinnedTweet = await Tweet.findOneAndUpdate(
        { tweetedBy: userId, pinned: true },
        { $set: { pinned: false } },
        { new: true }
      );

      if (previousPinnedTweet) {
        await tweetPopulate(previousPinnedTweet);
        updateCacheData(
          `tweets:${previousPinnedTweet._id}`,
          previousPinnedTweet
        );
      }
      tweet = await Tweet.findOneAndUpdate(
        { _id: tweetId, tweetedBy: userId },
        { $set: { pinned: true } },
        { new: true }
      );
      await tweetPopulate(tweet);
      updateCacheData(`tweets:${tweet._id}`, tweet);
    }
    res.send(tweet);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = pinController;
