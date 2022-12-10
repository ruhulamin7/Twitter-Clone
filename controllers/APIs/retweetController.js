const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const { cacheSetAndGet, updateCacheData } = require('../../utils/cacheManager');

async function retweetController(req, res, next) {
  try {
    const tweetId = req.params.id;
    const userId = req.userId;

    const deletedTweet = await Tweet.findOneAndDelete({
      tweetedBy: userId,
      originalTweet: tweetId,
    });

    let retweetObj = deletedTweet;

    if (retweetObj === null) {
      const tweet = new Tweet({
        tweetedBy: userId,
        originalTweet: tweetId,
      });
      retweetObj = await tweet.save();

      updateCacheData(`tweets:${retweetObj._id}`, retweetObj);
    }

    // option retweet or not
    const option = deletedTweet ? '$pull' : '$addToSet';

    // update retweet user
    const tweet = await Tweet.findOneAndUpdate(
      { _id: tweetId },
      { [option]: { retweetedUsers: userId } },
      { new: true }
    );

    // update retweet cache data
    updateCacheData(`tweets:${tweetId}`, tweet);

    // update retweet user cache
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { [option]: { retweets: tweetId } },
      { new: true }
    );

    // update user cache data
    updateCacheData(`users:${userId}`, updatedUser);

    res.json(tweet);
  } catch (error) {
    next(error);
  }
}

module.exports = retweetController;
