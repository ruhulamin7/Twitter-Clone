const createHttpError = require('http-errors');
const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const { deleteCache, updateCacheData } = require('../../utils/cacheManager');
const { tweetPopulate } = require('../../utils/populator');

async function deleteTweet(req, res, next) {
  try {
    const tweetId = req.params.id;
    const userId = req.userId;

    const deletedTweet = await Tweet.findOneAndDelete({
      _id: tweetId,
      tweetedBy: userId,
    });

    if (deletedTweet !== null) {
      await deleteCache(`tweets:${deletedTweet._id}`);
      res.send(deletedTweet);
    } else {
      return next(createHttpError(500, error));
    }

    // remove form replayed data form main tweet if it exists
    if (deletedTweet?.replayTo) {
      const updatedTweet = await Tweet.findOneAndUpdate(
        { _id: deletedTweet.replayTo },
        {
          $pull: { replayedTweets: tweetId },
        },
        { new: true }
      );

      await tweetPopulate(updatedTweet);
      updateCacheData(`tweets:${updatedTweet._id}`, updatedTweet);
    }

    // remove the userId from retweetedUsers array if deleted post was retweeted post
    if (deletedTweet?.originalTweet) {
      const retweetedTweet = Tweet.findOneAndUpdate(
        {
          _id: deletedTweet.originalTweet,
        },
        {
          $pull: { retweetedUsers: userId },
        },
        { new: true }
      );
      await tweetPopulate(retweetedTweet);
      updateCacheData(`tweets:${retweetedTweet._id}`, retweetedTweet);
    }

    // delete the retweeted id from users who retweeted this deleted post
    if (deletedTweet?.retweetedUsers.length) {
      deletedTweet?.retweetedUsers?.forEach(async (uId) => {
        const updatedUser = await User.findOneAndUpdate(
          { _id: uId },
          {
            $pull: { retweets: deletedTweet._id },
          },
          { new: true }
        );
        updateCacheData(`users:${updatedUser._id}`, updatedUser);
      });
    }

    // delete all the retweeted post which was deleted
    if (deletedTweet?.retweetedUsers.length) {
      deletedTweet?.retweetedUsers?.forEach(async (uId) => {
        const deletedRetweetedTweet = await Tweet.findOneAndDelete({
          originalTweet: deletedTweet._id,
          tweetedBy: uId,
        });
        deleteCache(`tweets:${deletedRetweetedTweet._id}`);
      });
    }

    // remove the postId from likes array of users who likes the deleted tweet
    if (deletedTweet?.likes?.length) {
      deletedTweet?.likes?.forEach(async (uId) => {
        const updatedUser = await User.findOneAndUpdate(
          { _id: uId },
          { $pull: { likes: deletedTweet._id } },
          { new: true }
        );

        await tweetPopulate(updatedUser);
        updateCacheData(`users:${updatedUser._id}`, updatedUser);
      });
    }
  } catch (error) {
    next(createHttpError(500, error));
  }
}
// module exports
module.exports = deleteTweet;
